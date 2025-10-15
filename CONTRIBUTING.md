# Contributing Guide

## 개발 원칙
- 다이얼로그 UI는 예제일 뿐이며, 사용자는 자신의 UI 컴포넌트를 직접 구현해야 한다.
- 포커스, 키보드, 애니메이션 등 행동은 각 다이얼로그 내부에서 수동으로 제어한다.
- `useLayerBehavior` 훅은 ESC/외부 클릭 보조 기능만 제공하며, 포커스는 애플리케이션 책임이다.
- 새로운 기능을 추가할 때는 README와 Docs를 동시에 업데이트한다.
- PR에는 의사결정 배경을 간단히 기록하고, 테스트(필요 시 `pnpm test` / `pnpm --filter example run build`)를 실행한다.

## 코드 스타일 & 패턴
- TypeScript/React 컴포넌트는 함수형 컴포넌트와 hooks 기반으로 작성한다.
- 상태 스택(`AppDialogState`, UI 매핑)은 사용자가 구성한다. 코어는 스택 관리와 z-index 계산에 집중한다.
- `framer-motion` 사용 여부는 예제에 한정된다. 라이브러리 코어는 외부 애니메이션 라이브러리에 의존하지 않는다.
- 필요한 경우 `DECISIONS.md`에 논의된 결정을 업데이트하여 팀이 공유할 수 있도록 한다.

