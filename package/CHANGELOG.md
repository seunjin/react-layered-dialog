## 0.6.0

### Minor Changes

- **feat**: `createDialogApi` 레지스트리 키 기반의 ID 생성 로직 도입 (각 키마다 독립된 순번 카운터 유지)
- **feat**: `resolve` 호출 시 제네릭 타입을 통한 비동기 데이터 반환 지원 강화
- **refactor**: API 명칭 일관성 확보 (`getStateFields` -> `getProps`, `getStateField` -> `getProp`)
- **refactor**: 불필요한 `isMounted` 필드 제거 및 `useMemo` 의존성 보강을 통한 렌더링 안정성 최적화
- **test**: `DialogStore` 및 `DialogsRenderer`에 대한 엣지 케이스 테스트 추가 (총 16개 테스트 통과)
- **docs**: API 문서의 시각적 계층 구조 재설계 (미니멀 JSDoc 스타일 도입, 폰트 스케일 상향, 사이드바 최적화)

### Minor Changes

- 45b04d6: feat: 리뉴얼된 API/문서로 전면 전환 (0.5.0)

  Breaking Changes
  - DialogManager/createUseDialogs 계열 레거시 API 제거
  - 레거시 타입 구조 정리 및 컨트롤러 중심(useDialogController) 모델로 전환
  - 동일 ID 중복 오픈 시 Error 발생

  Added
  - DialogStore 기반 스택 관리(open/openAsync/close/unmount/...)
  - DialogsRenderer + 컨텍스트 컨트롤러(컴포넌트 내부 close/update/status/stack)
  - defineDialog / createDialogApi 레지스트리로 타입 안전한 메서드 자동 생성
  - Promise 기반 비동기 다이얼로그(openAsync + resolve/reject)
  - DialogStatus('idle'|'loading'|'done'|'error')와 스택 메타(topId/size/index)

  Changed
  - z-index: baseZIndex에서 시작, open 시 증가, 스택이 비면 reset
  - 문서 개편: Fundamentals(개념) ↔ API(시그니처) 분리, 사이드바 Core/Types/Advanced 그룹, 타이틀 영어화
  - 모바일 코드 블록 가로 오버플로우 해결(wrapLongLines, max-width)

  Migration (요약)
  1. 루트에 <DialogsRenderer store={store}/> 배치
  2. DialogStore 생성 + createDialogApi/defineDialog로 레지스트리 구성
  3. openDialog('type', payload) → dialog.type(payload)
  4. 컴포넌트 내부는 useDialogController()로 close/unmount/update/status/stack 제어
  5. 비동기는 await dialog.confirm(...) 형태로 전환

## 0.4.0

### Minor Changes

- fa1d48a: **BREAKING CHANGE**: `BaseLayerProps`의 `dismissable` 속성명이 `closeOnEscape`으로 변경되었습니다. 이 변경은 ESC 키를 눌렀을 때 다이얼로그가 닫히는 동작을 더 명확하게 나타냅니다.

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
