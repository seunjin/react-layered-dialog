# 소개 (Introduction)

`react-layered-dialog`는 React 18 브라우저 환경에서 다이얼로그(모달, 팝업, 서랍 등)를 효율적으로 관리하기 위한 **Headless & Layer-first 다이얼로그 매니저**입니다.

## 핵심 철학

이 라이브러리는 다음 세 가지 원칙 위에 설계되었습니다:

### 1. Headless UI
우리는 당신의 디자인 시스템을 존중합니다. 라이브러리는 닫기 버튼의 위치나 애니메이션 방식을 강제하지 않습니다. 오직 다이얼로그의 **생명주기(Life-cycle)**와 **데이터 흐름**만을 담당합니다.

### 2. Layer-first (Automatic Z-Index)
다이얼로그가 층층이 쌓이는 시나리오에서 개발자가 `z-index`를 직접 계산할 필요가 없습니다. 스토어가 다이얼로그의 선후 관계를 파악하여 적절한 적층 순서를 자동으로 관리합니다.

### 3. Zero-dependency & Lightweight
React 18의 `useSyncExternalStore`를 기반으로 하며, 다른 외부 라이브러리에 의존하지 않습니다. 매우 가볍고 번들 사이즈에 미치는 영향이 최소화되어 있습니다.

## 주요 특징

- **Type-safe Registry**: 컴포넌트 등록 시점부터 호출부까지 완벽한 TypeScript 타입 추론을 제공합니다.
- **Controller Pattern**: 다이얼로그 내부에서 `useDialogController`를 통해 자신의 상태를 능동적으로 제어합니다.
- **Async Workflow Support**: Promise 기반의 `openAsync` 또는 `confirm`을 통해 사용자 입력을 동기적인 흐름처럼 처리할 수 있습니다.
- **SSR Friendly**: 싱글턴 패턴에 의존하지 않고 요청 단위로 스토어를 생성하고 연결할 수 있도록 설계되었습니다.

## 왜 사용해야 하나요?

기존의 단순한 모달 라이브러리들은 중첩된 다이얼로그에서의 상태 관리, 복잡한 비동기 흐름 처리, 그리고 디자인의 제약이라는 문제를 안고 있습니다. `react-layered-dialog`는 이러한 고질적인 문제들을 아키텍처 레벨에서 해결하여, 복잡한 비즈니스 로직을 가진 다이얼로그 앱을 더 견고하게 선언할 수 있게 돕습니다.
