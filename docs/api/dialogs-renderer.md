# DialogsRenderer

스토어에 등록된 다이얼로그들을 실제로 화면에 그리는 역할을 하는 리액트 컴포넌트입니다.

## Props

### `store: DialogStore` (필수)
렌더링할 다이얼로그 정보가 담긴 `DialogStore` 인스턴스입니다.

### `containerId?: string` (선택)
다이얼로그 래퍼 요소에 부여할 ID입니다. (기본값 없음)

## 사용 패턴

다이얼로그가 다른 요소들보다 위에 위치할 수 있도록 보통 애플리케이션의 최상단 레벨에 한 번만 배치합니다.

```tsx
import { DialogsRenderer } from 'react-layered-dialog';
import { myStore } from './lib/dialogs';

function Layout({ children }) {
  return (
    <div className="app">
      {children}
      {/* 화면의 가장 바깥쪽에 위치 */}
      <DialogsRenderer store={myStore} />
    </div>
  );
}
```

## 렌더링 원리
`DialogsRenderer`는 스토어의 `entries`를 순회하며 각 엔트리의 `renderer` 함수를 호출합니다. 이때 `DialogControllerContext`를 제공하여 하위 컴포넌트들이 `useDialogController`를 사용할 수 있게 합니다.
