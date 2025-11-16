# React Layered Dialog ![npm](https://img.shields.io/npm/v/react-layered-dialog) ![bundlephobia](https://img.shields.io/bundlephobia/minzip/react-layered-dialog) ![license](https://img.shields.io/npm/l/react-layered-dialog)

React 18 `useSyncExternalStore` 기반 경량 다이얼로그 매니저

---

## Live Demo & Docs

더 자세한 설명과 다양한 사용 예제는 아래 공식 문서 페이지에서 확인하실 수 있습니다.

**[Live Demo 바로가기](https://seunjin.github.io/react-layered-dialog/getting-started/introduction)**

---

## Requirements

- React 18 이상(React 18의 `useSyncExternalStore` 기반)
- TypeScript 권장

---

## Quick Start

### 설치

```bash
pnpm add react-layered-dialog
```

또는

```bash
npm i react-layered-dialog
# 또는
yarn add react-layered-dialog
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

### 최소 셋업 예시(경로 별칭 없이)

아래 3개 파일만으로 바로 동작하는 가장 작은 구성입니다.

1) dialogs.ts

```ts
import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from './Alert';

export const dialogStore = new DialogStore();
export const dialog = createDialogApi(dialogStore, {
  alert: { component: Alert }, // sync
});
```

2) Alert.tsx

```tsx
import { useDialogController } from 'react-layered-dialog';

type AlertProps = { title: string; message: string };

export function Alert(props: AlertProps) {
  const { getStateFields, close, unmount, zIndex } = useDialogController<AlertProps>();
  const { title, message } = getStateFields(props);
  return (
    <div role="alertdialog" aria-modal="true" style={{ zIndex }}>
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={() => { close(); unmount(); }}>확인</button>
    </div>
  );
}
```

3) App.tsx

```tsx
import { DialogsRenderer } from 'react-layered-dialog';
import { dialog, dialogStore } from './dialogs';

export default function App() {
  return (
    <>
      <button onClick={() => dialog.alert({ title: '안내', message: '완료되었습니다' })}>
        알림 열기
      </button>
      <DialogsRenderer store={dialogStore} />
    </>
  );
}
```

자세한 시그니처는 아래 API 문서를 참고하세요.

- API → DialogStore: https://seunjin.github.io/react-layered-dialog/api/dialog-store
- API → Types: https://seunjin.github.io/react-layered-dialog/api/types

---

> Note: 라이브러리는 포커스/ESC/외부 클릭/스크롤 락 같은 동작을 강제하지 않습니다. 필요한 정책은 다이얼로그 컴포넌트 내부에서 컨트롤러(`useDialogController`)와 훅을 조합해 구현하세요.

---

## Why React Layered Dialog?

| Feature | React Layered Dialog | 일반 Modal 라이브러리 |
| :--- | :--- | :--- |
| 선언적/레지스트리 기반 API | ✅ `createDialogApi` 레지스트리에서 안전한 메서드 자동 생성 | ❌ 수동 상태관리/보일러플레이트 |
| TypeScript-first | ✅ 정의→호출까지 완전한 타입 추론 | ❌ 제한적 혹은 느슨한 타입 |
| Controller 패턴 | ✅ 컴포넌트 내부에서 close/update/status/stack 일관 제어 | ❌ onClose 같은 단일 콜백 의존 |
| 자동 z-index | ✅ 중첩 열림 시 자동 증가/리셋 | ❌ 수동 지정/충돌 위험 |
| Headless | ✅ UI/애니메이션/포커스 정책 비강제(완전 커스터마이즈) | ❌ 특정 UI/동작 강제 |
| SSR/멀티 스토어 친화 | ✅ 요청 단위 스토어, 렌더러 연결 원칙 | ❌ 전역 싱글턴 가정 많음 |
| 경량/외부 의존성 없음 | ✅ 소형 번들, 외부 의존성 없음 | ❌ 무거운 의존성 포함 |

---

## 기여하기

이 프로젝트는 Conventional Commits 명세를 따릅니다.
버전 관리 및 배포는 Changesets를 사용합니다. 자세한 내용은 [배포 가이드](./docs/03-releasing.md)를 참고하세요.
