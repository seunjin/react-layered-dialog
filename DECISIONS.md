# Architectural Decisions

## 포커스 및 접근성
- 라이브러리는 자동 포커스 이동을 제공하지 않는다. 다이얼로그 컴포넌트(예: Alert, Confirm 등)는 필요 시 `useEffect`에서 `ref.current?.focus()`로 직접 제어한다.
- `useLayerBehavior`는 ESC/외부 클릭 등의 보조 기능만 제공하며 포커스 관련 옵션(`autoFocus`, `focusRef`)은 제거했다. 포커스 정책은 애플리케이션이 결정한다.

## 다이얼로그 구현 철학
- `AppDialogState`는 각 애플리케이션이 직접 정의하고, 상태별 UI 컴포넌트도 사용자가 구현한다. 라이브러리는 상태 스택 관리(`openDialog`, `closeDialog`, `updateDialog`)와 z-index 계산만 책임진다.
- 외부 UI 라이브러리(shadcn 등)를 기반으로 한 래퍼 컴포넌트는 공식 패키지에 포함하지 않는다. 필요 시 사용자가 래핑하도록 가이드만 제공하거나 예제를 문서에서 참조한다.
- 상태 타입은 `BaseState` 또는 `DialogState<T>` 패턴을 기본으로 사용한다. 이렇게 하면 `BaseLayerProps`(dimmed, dismissable 등)와 메타 필드(`id`, `isOpen`, `zIndex`)가 자동으로 일관성 있게 적용된다.

## 애니메이션 전략
- 기본 Alert/Confirm/Modal 컴포넌트는 `framer-motion`을 사용하지만, 이는 예제일 뿐 강제 사항이 아니다. 다른 다이얼로그는 CSS transition 등 원하는 방식을 선택할 수 있다.
- 포커스, 모션, exit 타이밍을 제어할 책임은 각 다이얼로그 컴포넌트에 있다.

## 문서 & 코드 템플릿
- README와 Docs는 항상 최신 API(포커스 직접 제어 등)를 반영하도록 유지한다.
- 코드 템플릿은 예제 흐름과 동일한 패턴(수동 포커스, ESC 처리 등)을 보여주어 복사 시 일관된 스타일을 유지한다.
- 오버레이는 `pointer-events-none` + 내부 `pointer-events-auto` 패턴으로 구현해 dim을 끄더라도 배경 인터랙션을 보장한다.
- `scrollLock` 등 전역 동작 플래그는 `DialogRenderer`가 전체 다이얼로그 배열을 기준으로 제어한다. 개별 훅에서는 전역 DOM 조작을 수행하지 않는다.
