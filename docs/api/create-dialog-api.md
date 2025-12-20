# createDialogApi

`createDialogApi`는 `DialogStore`를 래핑하여, 프로젝트에서 사용할 다이얼로그들을 미리 등록하고 타입 안전성이 보장된 편리한 메서드들을 생성해줍니다.

## 사용법

```ts
import { DialogStore, createDialogApi } from 'react-layered-dialog';

const store = new DialogStore();
export const dialog = createDialogApi(store, {
  confirm: { component: MyConfirm, mode: 'async' },
  notice: { component: MyNotice, mode: 'sync' }
});
```

## 설정 옵션 (DialogConfig)

각 다이얼로그 키에 다음과 같은 옵션을 지정할 수 있습니다.

- **`component`**: 사용할 React 컴포넌트입니다.
- **`mode`**: `'sync'` | `'async'` (기본값: `'sync'`)
  - `async` 모드로 설정된 다이얼로그 호출 시 자동으로 `openAsync`가 사용됩니다.
- **`defaultProps`**: (선택 사항) 해당 다이얼로그를 열 때 기본적으로 적용될 props입니다.

## 생성된 API의 특징

- **타입 추론**: 등록된 컴포넌트의 Props 타입을 자동으로 인식하여 호출 시 타입 검사를 수행합니다.
- **메서드 체이닝**: `dialog.confirm(...)`, `dialog.notice(...)` 처럼 직관적인 호출이 가능합니다.
- **ID 자동 생성**: 호출 시 `id`를 생략하면 레지스트리 키 기반의 고유 ID(예: `confirm-0`)를 자동으로 생성합니다.
- **Base Access**: `dialog.open`, `dialog.update` 등 스토어의 기본 메서드에도 직접 접근할 수 있습니다.
