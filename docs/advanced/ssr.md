# SSR 지원 (Server-Side Rendering)

> Next.js App Router 및 SSR 환경에서 `react-layered-dialog`를 안전하게 사용하는 방법을 다룹니다.

---

## ⚠️ 왜 SSR에서 조심해야 하는가?

### 서버 메모리 공유 문제 (Shared Memory Risk)

Next.js의 서버 환경에서 전역 변수로 `new DialogStore()`를 생성하면, **서버 메모리에 스토어가 올라가고 모든 사용자 요청이 이를 공유**합니다.

```ts
// ❌ 절대 금지: 서버에서 공유되는 전역 스토어
export const store = new DialogStore();
```

이렇게 하면 **A 사용자가 연 모달이 B 사용자에게 보이는 심각한 보안 사고**가 발생할 수 있습니다.

### Hydration Mismatch

서버에서 생성된 HTML(스토어 없음)과 클라이언트의 초기 렌더링(스토어 있음)이 달라 React 경고가 발생합니다.

### `window` / `document` 미존재

서버 환경(Node.js)에는 `window`나 `document` 객체가 없어 빌드가 실패하거나 런타임 에러가 발생합니다.

---

## 권장 패턴: Client-Only Provider

`useState`와 `useEffect`를 사용하여 **스토어 생성을 브라우저 환경까지 철저히 지연(Lazy Initialization)**시킵니다.

```tsx
// lib/dialog/DialogProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DialogStore, DialogsRenderer } from "react-layered-dialog";

const DialogStoreContext = createContext<DialogStore | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  // 초기값은 null. 서버에서는 절대 생성되지 않음.
  const [store, setStore] = useState<DialogStore | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 마운트 후(브라우저)에만 실행됨 -> window 접근 안전
    setStore(new DialogStore());
    setIsMounted(true);
  }, []);

  return (
    <DialogStoreContext.Provider value={store}>
      {children}
      {/* store가 없을 때는 렌더러를 그리지 않아 Hydration 에러 방지 */}
      {isMounted && store && <DialogsRenderer store={store} />}
    </DialogStoreContext.Provider>
  );
}

export function useDialogStore() {
  return useContext(DialogStoreContext);
}
```

---

## 안전한 Hook: Proxy 패턴

### 문제: "초기화 찰나의 순간"

위의 Client-Only Provider 패턴을 사용하면, 앱이 처음 켜지는 **첫 번째 렌더링(First Render)** 시점에는 `store`가 `null`입니다. 이때 컴포넌트에서 `useDialog().open()`을 호출하면 `Null Reference Error`로 앱이 죽습니다.

### 해결: Proxy를 이용한 안전장치

`useDialog` 훅은 스토어가 준비되지 않았을 때 `null` 대신 **"가짜 객체(Proxy)"**를 반환합니다.

```ts
// lib/dialog/useDialog.ts
import { useMemo } from "react";
import type { DialogStore } from "react-layered-dialog";
import { useDialogStore } from "./DialogProvider";

export function useDialog(): DialogStore {
  const store = useDialogStore();

  return useMemo(() => {
    if (store) return store;

    // 스토어가 없으면 '가짜 스토어'를 반환
    return new Proxy({} as DialogStore, {
      get(_, prop) {
        // 메서드 호출 시 에러 대신 경고만 출력하고 앱은 죽지 않음
        return (...args: unknown[]) => {
          console.warn(
            `[DialogSystem] '${String(prop)}' 호출 시점에 아직 Store가 준비되지 않았습니다.`
          );
        };
      },
    });
  }, [store]);
}
```

이로 인해 개발자는 매번 `if (store)` 체크를 할 필요 없이 편하게 코딩할 수 있으며, 실수로 일찍 호출하더라도 앱이 셧다운되는 최악의 상황을 막을 수 있습니다.

---

## 컴포넌트 외부에서 사용하기 (Axios Interceptor 등)

### 문제: Axios Interceptor와 전역 모달

API 에러(401 등) 발생 시 모달을 띄워야 하지만, `Axios Interceptor`나 일반 `.ts` 파일은 React 컴포넌트가 아니므로 `useDialog` 훅을 사용할 수 없습니다.

### 해결: Lazy Singleton 패턴

SSR의 안전성을 해치지 않으면서 전역 인스턴스를 사용하는 방법입니다.

```ts
// lib/dialog/globalDialog.ts
import { DialogStore } from "react-layered-dialog";

let globalStore: DialogStore | null = null;

/**
 * 컴포넌트 외부(Axios Interceptor 등)에서 다이얼로그를 사용하기 위한 전역 스토어입니다.
 * 서버 환경에서는 null을 반환하여 SSR 안전성을 보장합니다.
 */
export function getGlobalDialog() {
  if (typeof window === "undefined") return null;

  if (!globalStore) {
    globalStore = new DialogStore();
  }
  return globalStore;
}
```

> [!NOTE]
> 이 전역 스토어는 Context 기반 `useDialog` 훅과는 **별도의 스토어**입니다. 따라서 `DialogsRenderer`도 각각 배치해야 합니다. 이는 라이브러리의 Headless 설계 철학에 따른 구조입니다.

---

## Next.js App Router 통합 최종 레시피

### 1. `DialogProvider.tsx` (통합 버전)

Context 기반 스토어와 전역 스토어의 렌더러를 함께 배치합니다.

```tsx
// lib/dialog/DialogProvider.tsx
"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { DialogStore, DialogsRenderer } from "react-layered-dialog";
import { getGlobalDialog } from "./globalDialog";

const DialogStoreContext = createContext<DialogStore | null>(null);

export interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [store, setStore] = useState<DialogStore | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const globalStore = getGlobalDialog(); // 브라우저에서만 값이 있음

  useEffect(() => {
    setStore(new DialogStore());
    setIsMounted(true);
  }, []);

  return (
    <DialogStoreContext.Provider value={store}>
      {children}
      {/* Context 기반 다이얼로그 (useDialog 훅 사용) */}
      {isMounted && store && <DialogsRenderer store={store} />}
      {/* Axios 등 외부 호출용 전역 다이얼로그 */}
      {isMounted && globalStore && <DialogsRenderer store={globalStore} />}
    </DialogStoreContext.Provider>
  );
}

export function useDialogStore() {
  return useContext(DialogStoreContext);
}
```

### 2. `ClientProviders.tsx` 분리

`layout.tsx`는 서버 컴포넌트이므로, 별도 파일로 분리하고 `"use client"`를 선언합니다.

```tsx
// components/ClientProviders.tsx
"use client";

import dynamic from "next/dynamic";

// SSR 단계에서 아예 로드하지 않음 (ssr: false)
const DialogProvider = dynamic(
  () => import("@/lib/dialog/DialogProvider").then((m) => m.DialogProvider),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <DialogProvider>{children}</DialogProvider>;
}
```

### 3. `layout.tsx`에 적용

```tsx
// app/layout.tsx
import { ClientProviders } from "@/components/ClientProviders";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
```

---

## 요약

| 문제 | 해결책 |
| :--- | :--- |
| 서버 메모리 공유 (보안 위험) | `useState` + `useEffect`로 클라이언트에서만 스토어 생성 |
| Hydration Mismatch | `isMounted` 상태로 렌더러 조건부 렌더링 |
| 초기 마운트 전 호출 에러 | Proxy 패턴으로 안전한 `useDialog` 훅 구현 |
| 컴포넌트 외부 사용 (Axios 등) | `typeof window !== 'undefined'` 체크 + Lazy Singleton |

---

## Edge Runtime 주의사항

Vercel Edge Functions, Cloudflare Workers 등의 **Edge Runtime 환경**에서도 동일한 문제가 발생할 수 있습니다.

> [!CAUTION]
> Edge Runtime은 Node.js와 다른 격리 모델을 사용하지만, 여전히 **전역 변수가 여러 요청 간 공유될 수 있습니다**. 반드시 위에서 설명한 Client-Only Provider 패턴을 사용하세요.

```ts
// ❌ Edge Runtime에서도 위험
export const store = new DialogStore();

// ✅ 안전: 클라이언트에서만 생성
const [store, setStore] = useState<DialogStore | null>(null);
useEffect(() => setStore(new DialogStore()), []);
```

---

## 테스트 환경 (Jest/Vitest) 설정

테스트 환경에서는 `window` 객체가 없거나 불완전할 수 있어 추가 설정이 필요합니다.

### Vitest 설정 예시

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // DOM 환경 시뮬레이션
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

### 테스트 시 주의사항

1.  **Provider 래핑**: 테스트에서 `useDialog`를 사용하는 컴포넌트는 반드시 `DialogProvider`로 래핑해야 합니다.
2.  **비동기 마운트 대기**: `useEffect`에서 스토어가 생성되므로, 테스트에서 `waitFor`나 `act`를 사용해 마운트 완료를 기다려야 합니다.

```tsx
// 테스트 예시
import { render, waitFor } from '@testing-library/react';
import { DialogProvider } from '@/lib/dialog/DialogProvider';

test('다이얼로그가 열리는지 확인', async () => {
  const { getByText } = render(
    <DialogProvider>
      <MyComponent />
    </DialogProvider>
  );

  // 마운트 완료 대기
  await waitFor(() => {
    expect(getByText('다이얼로그 열기')).toBeInTheDocument();
  });
});
```

---

## 디버깅 팁

문제가 발생했을 때 원인을 진단하는 방법입니다.

### 1. 스토어 생성 시점 확인

스토어가 의도한 대로 클라이언트에서만 생성되는지 확인합니다.

```tsx
useEffect(() => {
  console.log('[Dialog] 스토어 생성 시작 - 이 로그는 브라우저에서만 보여야 함');
  setStore(new DialogStore());
  setIsMounted(true);
}, []);
```

### 2. 서버/클라이언트 환경 확인

현재 실행 환경이 서버인지 클라이언트인지 확인합니다.

```ts
console.log('[Dialog] 현재 환경:', typeof window === 'undefined' ? '서버' : '클라이언트');
```

### 3. Hydration 에러 진단

React DevTools의 "Highlight updates" 기능을 활성화하여 Hydration Mismatch가 발생하는 컴포넌트를 식별합니다.

### 4. 흔한 실수 체크리스트

- [ ] `"use client"` 지시어를 빼먹지 않았는가?
- [ ] `DialogsRenderer`를 서버 컴포넌트에서 직접 렌더링하고 있지 않은가?
- [ ] 전역 스코프에서 `new DialogStore()`를 호출하고 있지 않은가?
- [ ] `dynamic import`의 `ssr: false` 옵션을 설정했는가?

---

## 관련 문서

- [다중 스토어 운영](./multiple-stores.md)
- [커스텀 레지스트리](./custom-registry.md)
- [Next.js Provider 레시피](../recipes/nextjs-provider.md)
