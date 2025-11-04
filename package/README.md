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

`react-layered-dialog`는 `useDialogs` 훅을 통해 매우 간단하게 다이얼로그를 열고 관리할 수 있습니다.

```tsx
import { useDialogs } from '@/lib/dialogs'; // 1. 설정된 훅 임포트
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';

function App() {
  const { openDialog, store } = useDialogs();

  const showAlert = () => {
    // 2. 원하는 다이얼로그를 타입과 함께 호출
    openDialog('alert', {
      title: '알림',
      message: '안녕하세요! React Layered Dialog 입니다.',
    });
  };

  return (
    <>
      <button onClick={showAlert}>알림 열기</button>

      {/* 3. 앱 최상단에 렌더러 추가 */}
      <DialogRenderer store={store} />
    </>
  );
}
```

> 전체 설정 과정( `DialogStore`, `createDialogApi` 등)에 대한 자세한 내용은 [공식 문서](https://seunjin.github.io/react-layered-dialog/getting-started/quick-start)를 참고해 주세요.

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
