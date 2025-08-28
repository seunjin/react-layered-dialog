# React Layered Dialog

**복잡한 다이얼로그 상태를 선언적이고 타입-안전하게 관리하는 솔루션**

React 애플리케이션에서 다이얼로그(모달, 알림창 등)를 관리할 때, `z-index` 충돌, 상태 끌어올리기(prop drilling)와 같은 문제에 직면하곤 합니다. `React Layered Dialog`는 이러한 문제를 해결하기 위해 고안된 경량 라이브러리입니다.

단일 `useDialogs` 훅을 통해 애플리케이션의 어느 컴포넌트에서든 다이얼로그를 쉽게 열고 닫을 수 있는 중앙 집중식 API를 제공하여, 다이얼로그 관리를 직관적이고 예측 가능하게 만듭니다.

## ✨ 핵심 기능

* **선언적 API**: `useState` 대신 `openDialog('confirm', { ... })`와 같이 선언적으로 다이얼로그를 제어합니다.
* **타입 안정성**: TypeScript를 완벽하게 지원하여, 다이얼로그 `type`에 따라 필요한 `props`를 자동으로 추론합니다.
* **자동 z-index 관리**: 여러 다이얼로그가 중첩되어도 `z-index`가 자동으로 할당되어 레이어 순서를 보장합니다.
* **유연한 확장성**: `alert`, `confirm` 같은 기본 타입 외에도, 모든 React 컴포넌트를 모달 콘텐츠로 활용할 수 있습니다.

## 🚀 설치

```bash
pnpm add react-layered-dialog
```
💡 라이브 데모
➡️ 라이브 데모 바로가기

🤝 기여하기
이 프로젝트는 Conventional Commits 명세를 따릅니다.
버전 관리 및 배포는 Changesets를 사용합니다.

pnpm changeset 명령어를 통해 변경 사항을 기록하고, pnpm release:version으로 버전을 업데이트합니다. 마지막으로 pnpm release:publish를 통해 npm에 배포할 수 있습니다.