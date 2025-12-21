# SSR 지원 (Server-Side Rendering)

> Next.js App Router 및 SSR 환경에서 `react-layered-dialog`를 안전하게 사용하는 방법을 다룹니다.

---

## ⚠️ 핵심 보안 경고

Next.js 서버에서 전역 스토어를 생성하면 **다른 사용자의 모달 상태가 공유**될 수 있습니다. 이는 심각한 보안 사고입니다.

```ts
// ❌ 절대 금지: 서버에서 공유되는 전역 스토어
export const store = new DialogStore();
// → A 사용자가 연 모달이 B 사용자에게 보이는 심각한 보안 사고 발생 가능
```

---

## 왜 Next.js에서 특별한 패턴이 필요한가?

Next.js는 **React SPA와 근본적으로 다른 실행 모델**을 가집니다. 이 차이를 이해해야 안전하게 상태를 관리할 수 있습니다.

### React SPA vs Next.js SSR 비교

| 구분 | 🟢 React SPA (Vite, CRA) | 🔵 Next.js (SSR/RSC) |
|:-----|:-------------------------|:---------------------|
| **실행 환경** | 모든 코드가 브라우저에서만 실행 | 서버(Node.js)에서 먼저 실행 후 브라우저로 전송 |
| **인스턴스** | 각 사용자마다 별도의 브라우저 탭 (완전 격리) | 하나의 Node.js 프로세스를 모든 요청이 공유 |
| **전역 변수** | 해당 브라우저 탭 내에서만 존재 | **모든 사용자 요청이 공유!** |
| **결론** | 전역 스토어 사용 안전 | 전역 스토어 사용 시 **보안 사고** |

### 서버 메모리 공유 문제 (상세 시나리오)

아래 코드를 보세요. React SPA에서는 문제없지만, Next.js에서는 심각한 버그입니다:

```ts
// lib/dialog.ts
import { DialogStore } from 'react-layered-dialog';

// 이 코드는 서버가 시작될 때 딱 한 번만 실행됨
// 이후 모든 사용자 요청이 이 'dialog' 인스턴스를 공유!
export const dialog = new DialogStore();
```

**실제 시나리오:**
1. 오전 9:00 - 서버 시작, `dialog` 인스턴스 생성 (빈 상태)
2. 오전 9:05 - 사용자 A가 접속, `dialog.open(<ConfirmModal />)` 호출
3. 오전 9:06 - 사용자 B가 접속, 화면을 보니 **사용자 A가 연 모달이 보임!**
4. 사용자 B가 모달을 닫으면 사용자 A의 화면에서도 모달이 닫힘

→ **사용자 간 상태가 섞이는 심각한 보안 사고!**

### Hydration Mismatch란?

**Hydration**이란 서버에서 생성된 HTML에 React가 이벤트 핸들러를 붙이는 과정입니다:

1. **1단계 (서버)**: React가 컴포넌트를 실행해서 HTML 문자열을 생성
2. **2단계 (네트워크)**: 이 HTML이 브라우저로 전송됨
3. **3단계 (클라이언트)**: React가 같은 컴포넌트를 다시 실행해서 가상 DOM 생성
4. **4단계 (비교)**: 서버 HTML과 클라이언트 가상 DOM이 일치하는지 확인

만약 서버에서는 `<DialogsRenderer />`가 렌더링되었는데, 클라이언트에서는 조건에 따라 렌더링되지 않으면 **불일치(Mismatch)**가 발생합니다. React는 경고를 출력하고 전체 트리를 다시 렌더링해야 하므로 성능이 저하됩니다.

### window/document 미존재

서버는 **Node.js 환경**이므로 브라우저 전용 객체가 없습니다:

- `window` - 브라우저 창 객체 (없음)
- `document` - DOM 문서 객체 (없음)
- `localStorage`, `sessionStorage` (없음)
- `navigator`, `location` (없음)

만약 스토어나 렌더러 내부에서 이들에 접근하면 `ReferenceError: window is not defined` 에러가 발생합니다.

---

## 해결책: 각 패턴의 이유

### 왜 useState + useEffect 패턴인가?

핵심 원리는 **스토어 생성을 브라우저로 완전히 미루는 것**입니다:

- **`useState(null)`**: 초기값은 `null`입니다. 서버에서 렌더링할 때 스토어 인스턴스가 생성되지 않습니다.
- **`useEffect`**: 이 훅은 **브라우저에서만 실행**됩니다. 서버에서는 절대 실행되지 않습니다. 따라서 `new DialogStore()`는 브라우저에서만 호출됩니다.
- **결과**: 각 사용자의 브라우저마다 독립적인 스토어 인스턴스가 생성됩니다. 서버 메모리 공유 문제가 원천 차단됩니다.

```tsx
// lib/dialog/DialogProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DialogStore, DialogsRenderer } from "react-layered-dialog";

const DialogStoreContext = createContext<DialogStore | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DialogStore | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // useEffect는 브라우저에서만 실행됨 (서버에서는 절대 실행 안 됨)
    // → 스토어가 서버 메모리에 올라가지 않음 = 요청 간 공유 불가
    setStore(new DialogStore());
    setIsMounted(true); // hydration 완료 표시
  }, []);

  return (
    <DialogStoreContext.Provider value={store}>
      {children}
      {/* isMounted가 true일 때만 렌더러 표시 → Hydration Mismatch 방지 */}
      {isMounted && store && <DialogsRenderer store={store} />}
    </DialogStoreContext.Provider>
  );
}

export function useDialogStore() {
  return useContext(DialogStoreContext);
}
```

### 왜 isMounted 상태가 필요한가?

`isMounted`는 **"Hydration이 완료되었다"**를 나타내는 플래그입니다:

| 단계 | isMounted 값 | DialogsRenderer |
|:-----|:-------------|:----------------|
| 서버 렌더링 시 | `false` | 렌더링 안 함 |
| 클라이언트 첫 렌더링 시 | `false` | 서버와 동일하게 렌더러 없음 |
| useEffect 실행 후 | `true` | 이제 렌더러 표시 |

이렇게 하면 서버와 클라이언트의 초기 렌더링 결과가 **완전히 동일**해집니다. Hydration Mismatch가 발생하지 않습니다. `useEffect` 이후에 렌더러가 나타나는 것은 정상적인 클라이언트 업데이트이므로 React가 문제 삼지 않습니다.

### 왜 Proxy 패턴인가?

Provider 패턴의 **부작용**이 있습니다: 초기 렌더링 시점에 스토어가 `null`입니다.

**문제 상황:**
```tsx
const dialog = useDialog(); // 반환값이 null
dialog.open(() => <Modal />); // ❌ TypeError: Cannot read property 'open' of null
```

매번 `if (dialog) dialog.open(...)` 체크를 하는 것은 번거롭습니다. **Proxy 패턴**을 사용하면 스토어가 없어도 메서드를 호출할 수 있습니다:

- JavaScript `Proxy`는 객체에 대한 접근을 가로채서 원하는 동작을 수행할 수 있게 합니다.
- 스토어가 `null`일 때 빈 객체 `{}`에 Proxy를 씌웁니다.
- 어떤 속성에 접근하든 (예: `.open`) `get` 트랩이 실행됩니다.
- 트랩은 경고만 출력하고 아무것도 하지 않는 함수를 반환합니다.
- 결과: 앱이 죽지 않고, 개발자는 콘솔에서 문제를 인지할 수 있습니다.

```ts
// lib/dialog/useDialog.ts
import { useMemo } from "react";
import type { DialogStore } from "react-layered-dialog";
import { useDialogStore } from "./DialogProvider";

export function useDialog(): DialogStore {
  const store = useDialogStore();

  return useMemo(() => {
    // 스토어가 이미 준비되어 있으면 그대로 반환
    if (store) return store;

    // 스토어가 아직 없으면 (SSR 시점 또는 초기 마운트 전)
    // → "가짜 객체"를 반환해서 에러 방지
    return new Proxy({} as DialogStore, {
      get(_, prop) {
        // 어떤 메서드를 호출해도 경고만 출력하고 앱은 죽지 않음
        return (...args: unknown[]) => {
          console.warn(`[DialogSystem] '${String(prop)}' 호출 시점에 아직 Store가 준비되지 않았습니다.`);
        };
      },
    });
  }, [store]);
}
```

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
  console.log('[Dialog] 스토어 생성 시작 - 이 로그는 브라우저 콘솔에서만 보여야 함');
  console.log('[Dialog] 서버 로그(터미널)에서 보이면 잘못된 것!');
  setStore(new DialogStore());
  setIsMounted(true);
}, []);
```

### 2. 서버/클라이언트 환경 확인

현재 실행 환경이 서버인지 클라이언트인지 확인합니다.

```ts
if (typeof window === 'undefined') {
  console.log('[Dialog] 현재 서버 환경');
} else {
  console.log('[Dialog] 현재 클라이언트(브라우저) 환경');
}
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
