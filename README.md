# React Layered Dialog ![npm](https://img.shields.io/npm/v/react-layered-dialog) ![bundlephobia](https://img.shields.io/bundlephobia/minzip/react-layered-dialog) ![license](https://img.shields.io/npm/l/react-layered-dialog)

React 18 `useSyncExternalStore` 기반 경량 다이얼로그 매니저

---

## Live Demo

> 🚧 라이브 데모 준비 중입니다. 곧 제공할 예정입니다.

---

## Quick Start

### 설치

```bash
pnpm add react-layered-dialog
```

### 기본 설정

`react-layered-dialog`는 유연한 API를 제공합니다. 아래 예시는 일반적인 설정 과정을 보여줍니다.

#### 1. 다이얼로그 설정 파일 생성 (`lib/dialogs.ts`)

```tsx
import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';

// 사용자 정의 다이얼로그 컴포넌트 임포트
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

// 각 다이얼로그가 받을 props 타입 정의 (BaseState 확장)
export interface AlertState extends BaseState {
  type: 'alert';
  title: string;
  message: string;
}

export interface ConfirmState extends BaseState {
  type: 'confirm';
  title: string;
  message: string;
  onConfirm: () => void;
}

// 모든 다이얼로그 타입을 유니온으로 결합
export type CustomDialogState = AlertState | ConfirmState;

// 다이얼로그 매니저 생성
const { manager } = createDialogManager<CustomDialogState>();

// 다이얼로그 타입과 실제 React 컴포넌트를 매핑
const componentMap = {
  alert: Alert,
  confirm: Confirm,
};

// useDialogs 훅 생성
export const useDialogs = createUseDialogs(manager, componentMap);
```

#### 2. 다이얼로그 렌더러 생성 (`components/DialogRenderer.tsx`)

다이얼로그 상태 배열을 실제 컴포넌트로 렌더링하는 역할을 합니다.

```tsx
import { useDialogs } from '@/lib/dialogs';

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </>
  );
};
```

#### 3. 앱에 적용 (`App.tsx`)

```tsx
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/DialogRenderer';

function App() {
  const { openDialog } = useDialogs();

  const showAlert = () => {
    openDialog('alert', { title: '알림', message: '안녕하세요!' });
  };

  return (
    <>
      <button onClick={showAlert}>
        알림 열기
      </button>

      {/* 앱 최상단에 렌더러를 추가합니다 */}
      <DialogRenderer />
    </>
  );
}
```

---

## Why React Layered Dialog?

| Feature           | React Layered Dialog           | 기존 Modal 라이브러리                   |
| ----------------- | ------------------------------ | --------------------------------------- |
| 선언적 API        | ✅ `openDialog('type', props)` | ❌ 상태 끌어올리기 또는 복잡한 상태관리 |
| 타입 안전성       | ✅ 완전한 TypeScript 지원      | ❌ 제한적 또는 없음                     |
| 자동 z-index 관리 | ✅ 다중 중첩 시 자동 처리      | ❌ 직접 관리 필요                       |
| 경량, 의존성 없음 | ✅ 1KB 미만                    | ❌ 무거운 의존성 포함                   |
| 확장성            | ✅ 모든 React 컴포넌트 지원    | ❌ 제한된 템플릿                        |

React Layered Dialog는 React 18의 `useSyncExternalStore`를 활용하여, 복잡한 다이얼로그 상태를 직관적이고 안전하게 관리할 수 있도록 설계되었습니다.

---

## Core Concepts

### 상태 구조 (State Shape)

- 다이얼로그 상태는 열린 다이얼로그들의 배열로 관리됩니다.
- 각 다이얼로그는 고유한 `id`, `type`, `props`를 가집니다.
- `z-index`는 배열 순서에 따라 자동 할당됩니다.

### 렌더러 (Renderer)

- 다이얼로그 타입별 React 컴포넌트를 등록하여 렌더링합니다.
- 다중 다이얼로그 중첩 시 최상위 다이얼로그가 사용자 인터랙션을 받습니다.

### 타입 시스템 (Type System)

- 다이얼로그 타입별로 필요한 props 타입을 명확히 정의하여 타입 안전성을 보장합니다.
- `openDialog` 호출 시 타입 추론을 통해 올바른 props를 강제합니다.

---

## API Reference

### `createDialogManager<T>()`

- 다이얼로그 상태를 관리하는 매니저 인스턴스를 생성합니다.
- `T`는 `type` 속성을 포함하는 모든 다이얼로그 상태의 유니온 타입입니다.

### `createUseDialogs(manager, componentMap)`

- 생성된 `manager`와 다이얼로그 `componentMap`을 기반으로 훅을 생성합니다.
- `componentMap`은 다이얼로그 `type` 문자열을 키로, 렌더링할 React 컴포넌트를 값으로 가집니다.

### `useDialogs()`

- 다이얼로그 상태(`dialogs`)와 제어 함수(`openDialog`, `closeDialog` 등)를 반환하는 훅입니다.
- `openDialog(type, props)`로 다이얼로그를 열고, `closeDialog(id)`로 닫을 수 있습니다.

---

## Recipes / Advanced Patterns

### Confirm 다이얼로그

```tsx
// lib/dialogs.ts 에서 ConfirmState 정의
export interface ConfirmState extends BaseState {
  type: 'confirm';
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// 사용처
openDialog('confirm', {
  message: '정말 삭제하시겠습니까?',
  onConfirm: () => {
    // ...삭제 로직
    closeDialog();
  },
  onCancel: () => closeDialog(),
});
```

### 다이얼로그 중첩 (Nesting)

- 여러 다이얼로그를 동시에 열 수 있으며, `z-index`가 자동 관리됩니다.
- 중첩 다이얼로그 내부에서 다시 `openDialog` 호출 가능.

### Toast 알림

- 다이얼로그 대신 Toast 컴포넌트를 등록하여 간단한 알림 구현 가능.
- 상태 제어 API를 그대로 활용.

---

## Accessibility

- 다이얼로그는 기본적으로 `role="dialog"` 또는 `role="alertdialog"`를 사용합니다.
- `aria-modal="true"` 속성을 설정하여 스크린 리더가 모달 상태를 인지하도록 합니다.
- 포커스 관리 및 키보드 내비게이션은 각 다이얼로그 컴포넌트에서 구현할 것을 권장합니다.

---

## 🤝 기여하기

이 프로젝트는 Conventional Commits 명세를 따릅니다.  
버전 관리 및 배포는 Changesets를 사용합니다.

`pnpm changeset` 명령어를 통해 변경 사항을 기록하고,  
`pnpm release:version`으로 버전을 업데이트합니다.  
마지막으로 `pnpm release:publish`를 통해 npm에 배포할 수 있습니다.