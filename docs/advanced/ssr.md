# SSR 지원 (Server-Side Rendering)

`react-layered-dialog`는 React의 `useSyncExternalStore`를 기반으로 하므로, Next.js와 같은 서버사이드 렌더링(SSR) 환경에서도 안정적으로 동작합니다.

## Next.js (App Router) 호환성

라이브러리 내부에서 React 훅을 사용하므로, 클라이언트 컴포넌트(`'use client'`)에서 사용해야 합니다.

### 1. 스토어 및 API 정의
스토어는 클라이언트 사이드 싱글톤으로 유지되어야 하므로 클라이언트 컴포넌트 파일에서 정의하는 것이 안전합니다.

```ts
// lib/dialogs.ts
'use client';

import { DialogStore, createDialogApi } from 'react-layered-dialog';

export const store = new DialogStore();
export const dialog = createDialogApi(store, { ... });
```

### 2. 렌더러 배치
`DialogsRenderer`는 보통 최상위 `layout.tsx`나 `Providers.tsx` 내부에서 브라우저 환경에서만 렌더링되도록 구성합니다.

```tsx
// components/Providers.tsx
'use client';

import { DialogsRenderer } from 'react-layered-dialog';
import { store } from '@/lib/dialogs';

export function Providers({ children }) {
  return (
    <>
      {children}
      <DialogsRenderer store={store} />
    </>
  );
}
```

## 하이드레이션(Hydration) 에러 방지

서버에서 생성된 HTML과 클라이언트의 첫 렌더링 결과가 다를 경우 하이드레이션 에러가 발생할 수 있습니다. `DialogsRenderer`는 내부적으로 첫 렌더링 이후에 상태를 동기화하므로 문제가 없으나, 다이얼로그 호출 시점은 반드시 사용자의 인터랙션(onClick 등) 이후여야 합니다.

## 요약

- **`'use client'`**: 스토어를 사용하는 모든 파일 상단에 명시하세요.
- **Client-only**: 렌더러는 서버에서 그릴 내용이 없으므로 클라이언트 사이드에서만 안전하게 동작합니다.
