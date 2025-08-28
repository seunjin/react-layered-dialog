# React Layered Dialog

선언적이고 타입-안전한 방식으로 React의 복잡한 다이얼로그 상태를 관리하는 라이브러리입니다.

## 소개

React 애플리케이션에서 다이얼로그(모달, 확인창, 알림창 등)를 관리하는 것은 종종 복잡한 상태 관리, z-index 충돌, 그리고 컴포넌트 간의 prop drilling을 유발합니다.

**React Layered Dialog**는 이러한 문제들을 해결하기 위해 설계되었습니다. 단일 `useDialogs` 훅을 통해 애플리케이션 어디서든 다이얼로그를 열고 닫을 수 있는 중앙집중적인 API를 제공하여, 다이얼로그 관리를 단순하고 예측 가능하게 만듭니다.

## 핵심 기능

-   **선언적 API:** `openDialog('alert', { ... })`와 같이 직관적인 API로 다이얼로그를 관리합니다.
-   **타입 안정성:** TypeScript 기반으로 다이얼로그의 `type`에 따라 필요한 `props`를 자동으로 추론합니다.
-   **자동 z-index 관리:** 여러 다이얼로그가 중첩될 때 z-index를 자동으로 계산하여 레이어 순서를 보장합니다.
-   **유연성과 확장성:** `alert`, `confirm`과 같은 기본 타입 외에, 어떤 React 컴포넌트든 모달 내부에 렌더링할 수 있습니다.

## 라이브 데모

이 라이브러리의 모든 기능을 직접 체험해볼 수 있는 데모 사이트를 제공합니다.

**[➡️ 라이브 데모 바로가기](https://seunjin.github.io/react-layered-dialog/)**

데모 사이트는 `Vite`, `React`, `TypeScript`, 그리고 `shadcn/ui`를 사용하여 제작되었으며, 다음과 같은 시나리오를 포함합니다.

-   기본적인 다이얼로그(Alert, Confirm, Modal) 사용법
-   여러 다이얼로그를 중첩하고 제어하는 고급 기능
-   API 요청과 같은 비동기 처리와 다이얼로그를 연동하는 실제적인 예제
-   개발자 콘솔을 통한 실시간 상태 변화 로깅

## 설치

```bash
pnpm add react-layered-dialog
```
