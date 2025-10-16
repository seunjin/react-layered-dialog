# react-layered-dialog

## 0.3.0

### Minor Changes

- - openDialog가 string 대신 { id, type } 형태의 DialogHandle을 반환하고, updateDialog는 핸들을 인자로 받도록 API를 전면 수정했습니다.
  - DialogHandle 타입을 추가하고, BaseStateMeta를 분리해 DialogState<T>에서는 Required<BaseStateMeta>를 병합해 id/isOpen을 명확히 보장하도록 타입 구조를 정리했습니다.

## 0.2.0

### Minor Changes

- **API 단순화 및 포커스 관리 방식 변경**
  - `useLayerBehavior` 훅에서 `autoFocus` 및 `focusRef` 옵션을 제거하여 API를 간소화했습니다.
  - 이제 다이얼로그가 열릴 때 `useEffect`를 사용하여 수동으로 포커스를 관리하는 방식을 권장합니다. 이를 통해 포커스 동작의 예측 가능성과 제어 수준을 높였습니다.
  - `Alert`, `Confirm`, `Modal` 예제 및 관련 코드 템플릿을 새로운 수동 포커스 관리 패턴을 반영하도록 모두 업데이트했습니다.

## 0.1.1

### Patch Changes

- docs: Add README to npm package

## 0.1.0

### Minor Changes

- Initial release
