# Next.js Provider 레시피

> Next.js App Router 환경에서 바로 복사해서 사용할 수 있는 다이얼로그 시스템 세팅 코드입니다.

---

## 파일 구조

```
lib/
└── dialog/
    ├── DialogProvider.tsx   # Provider 및 Context
    ├── useDialog.ts         # 안전한 Hook (Proxy 패턴)
    └── globalDialog.ts      # 컴포넌트 외부 사용 (선택)
components/
└── ClientProviders.tsx      # 클라이언트 전용 래퍼
```

---

## 1. `DialogProvider.tsx`

스토어 생성을 브라우저 환경까지 지연시키고, Context 기반 스토어와 전역 스토어의 렌더러를 함께 배치하는 Provider입니다.

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

/**
 * 다이얼로그 시스템을 위한 프로바이더입니다.
 * 내부적으로 DialogStore를 생성하고 DialogsRenderer를 배치합니다.
 */
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

/**
 * DialogStore 인스턴스에 접근하기 위한 내부 훅입니다.
 */
export function useDialogStore() {
  return useContext(DialogStoreContext);
}
```


---

## 2. `useDialog.ts`

SSR 및 초기 마운트 전에도 안전하게 호출할 수 있는 Hook입니다.

```ts
// lib/dialog/useDialog.ts
import { useMemo } from "react";
import type { DialogStore } from "react-layered-dialog";
import { useDialogStore } from "./DialogProvider";

/**
 * 다이얼로그를 열고 닫는 등 앱 어디서나 다이얼로그 시스템을 제어하기 위한 훅입니다.
 * SSR 환경이나 초기 마운트 전 store가 null인 상태에서도 
 * 런타임 에러 없이 안전하게 호출할 수 있도록 Proxy가 적용되어 있습니다.
 */
export function useDialog(): DialogStore {
  const store = useDialogStore();

  return useMemo(() => {
    if (store) return store;

    // 초기 마운트 전이나 SSR 시점에 안전하게 호출할 수 있는 Proxy 반환
    return new Proxy({} as DialogStore, {
      get(_, prop) {
        return (...args: unknown[]) => {
          console.warn(
            `[DialogSystem] '${String(prop)}' 호출 시점에 아직 Store가 준비되지 않았습니다. ` +
            `마운트 이후에 호출하거나 store 존재 여부를 확인해주세요.`
          );
        };
      },
    });
  }, [store]);
}

/**
 * 다이얼로그 내부 컴포넌트에서 자신의 상태를 제어하기 위한 훅입니다.
 */
export { useDialogController } from "react-layered-dialog";
```


---

## 3. `globalDialog.ts` (선택사항)

Axios Interceptor 등 컴포넌트 외부에서 다이얼로그를 호출해야 할 때 사용합니다.

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

---

## 4. `ClientProviders.tsx`

`layout.tsx`에서 사용할 클라이언트 전용 래퍼입니다.

```tsx
// components/ClientProviders.tsx
"use client";

import dynamic from "next/dynamic";

const DialogProvider = dynamic(
  () => import("@/lib/dialog/DialogProvider").then((m) => m.DialogProvider),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <DialogProvider>{children}</DialogProvider>;
}
```

---

## 5. `layout.tsx`에 적용

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

## 사용 예시

```tsx
// app/page.tsx
"use client";

import { useDialog } from "@/lib/dialog/useDialog";

export default function HomePage() {
  const dialog = useDialog();

  const handleClick = () => {
    dialog.open((controller) => (
      <div>
        <p>Hello, Dialog!</p>
        <button onClick={() => { controller.close(); controller.unmount(); }}>
          닫기
        </button>
      </div>
    ));
  };

  return <button onClick={handleClick}>다이얼로그 열기</button>;
}
```

---

## 관련 문서

- [SSR 지원 가이드](../advanced/ssr.md)
- [다중 스토어 운영](../advanced/multiple-stores.md)
