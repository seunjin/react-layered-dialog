# React Layered Dialog ![npm](https://img.shields.io/npm/v/react-layered-dialog) ![bundlephobia](https://img.shields.io/bundlephobia/minzip/react-layered-dialog) ![license](https://img.shields.io/npm/l/react-layered-dialog)

React 18 `useSyncExternalStore` 기반 경량 다이얼로그 매니저

---

## Live Demo & Docs

더 자세한 설명과 다양한 사용 예제는 아래 공식 문서 페이지에서 확인하실 수 있습니다.

**[Live Demo 바로가기](https://seunjin.github.io/react-layered-dialog/getting-started/introduction)**

---

## Quick Start

### 설치

```bash
pnpm add react-layered-dialog
```

### 기본 사용법

`react-layered-dialog`는 전역 `DialogStore`와 `createDialogApi`로 구성한 `dialog` 헬퍼를 통해 다이얼로그를 제어합니다.

```tsx
import { dialog, dialogStore } from '@/lib/dialogs';
import { DialogsRenderer } from 'react-layered-dialog';

function App() {
  const showConfirm = () => {
    // 1. 레지스트리에 등록된 다이얼로그 메서드를 호출
    dialog.confirm({
      title: '알림',
      message: '안녕하세요! React Layered Dialog 입니다.',
    });
  };

  return (
    <>
      <button onClick={showConfirm}>알림 열기</button>

      {/* 2. 앱 최상단에 렌더러 추가 */}
      <DialogsRenderer store={dialogStore} />
    </>
  );
}
```

> 전체 설정 과정( `DialogStore`, `createDialogApi` 등)에 대한 자세한 내용은 [공식 문서](https://seunjin.github.io/react-layered-dialog/getting-started/quick-start)를 참고해 주세요.

---

## Focus & Accessibility

`react-layered-dialog`는 포커스 이동을 자동으로 처리하지 않습니다. 각 다이얼로그 컴포넌트 안에서 표준
`autoFocus` 속성이나 필요에 맞는 포커스 전략을 직접 지정해 주세요.
필요한 경우 컨트롤러가 제공하는 스택 정보를 활용해 ESC, 외부 클릭 같은 동작을 직접 구현할 수 있습니다.

```tsx
import { useEffect, useRef } from 'react';
import { useDialogController } from 'react-layered-dialog';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

type AlertDialogProps = {
  title: string;
  message: string;
  onOk?: () => void;
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export const AlertDialog = (props: AlertDialogProps) => {
  const controller = useDialogController<AlertDialogProps>();
  const { close, unmount, getStateFields, stack, isOpen } = controller;
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    title,
    message,
    onOk,
    dimmed = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    scrollLock = true,
  } = getStateFields({
    title: props.title,
    message: props.message,
    onOk: props.onOk,
    dimmed: props.dimmed ?? true,
    closeOnEscape: props.closeOnEscape ?? true,
    closeOnOutsideClick: props.closeOnOutsideClick ?? true,
    scrollLock: props.scrollLock ?? true,
  });

  const handleClose = () => {
    onOk?.();
    close();
    unmount();
  };

  useEffect(() => {
    if (stack.index !== stack.size - 1 || !closeOnEscape) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, handleClose, stack.index, stack.size]);

  useEffect(() => {
    if (stack.index !== stack.size - 1 || !closeOnOutsideClick) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) handleClose();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClick, handleClose, stack.index, stack.size]);

  useBodyScrollLock(scrollLock && isOpen);

  return (
    <div role="alertdialog" aria-modal="true" ref={panelRef}>
      <h3>{title}</h3>
      <p>{message}</p>
      <button autoFocus onClick={handleClose}>확인</button>
    </div>
  );
};
```

이처럼 브라우저 기본 포커스를 활용하되, 필요하다면 `ref`와 `useEffect`를 조합해 세밀한 제어를 추가하세요.

---

## Why React Layered Dialog?

| Feature | React Layered Dialog | 일반 Modal 라이브러리 |
| :--- | :--- | :--- |
| **선언적 API** | ✅ `openDialog('type', props)` | ❌ 상태 끌어올리기 또는 복잡한 상태관리 |
| **타입 안전성** | ✅ 완전한 TypeScript 지원 | ❌ 제한적 또는 없음 |
| **자동 z-index 관리** | ✅ 다중 중첩 시 자동 처리 | ❌ 직접 관리 필요 |
| **경량, 의존성 없음** | ✅ 1KB 미만 | ❌ 무거운 의존성 포함 |
| **확장성** | ✅ 모든 React 컴포넌트 지원 | ❌ 제한된 템플릿 |

---

## 기여하기

이 프로젝트는 Conventional Commits 명세를 따릅니다.
버전 관리 및 배포는 Changesets를 사용합니다. 자세한 내용은 [배포 가이드](./docs/03-releasing.md)를 참고하세요.
