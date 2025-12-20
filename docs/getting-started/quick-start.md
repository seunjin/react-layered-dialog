# 빠른 시작 (Quick Start)

이 가이드는 `react-layered-dialog`를 프로젝트에 적용하는 핵심 3단계를 설명합니다.

## 1단계: 스토어 및 API 정의

보통 `src/lib/dialogs.ts`와 같은 파일에서 전역적으로 사용할 스토어와 다이얼로그 API를 정의합니다.

```ts
// src/lib/dialogs.ts
import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { ConfirmDialog } from '@/components/MyConfirm'; // 직접 만든 컴포넌트

// 상태가 저장될 스토어 생성
export const store = new DialogStore();

// 다이얼로그 컴포넌트들을 등록한 API 생성
export const dialog = createDialogApi(store, {
  confirm: { component: ConfirmDialog, mode: 'async' }
});
```

## 2단계: 렌더러 배치

애플리케이션의 최상단(예: `App.tsx` 또는 `Layout.tsx`)에 `DialogsRenderer`를 배치하여 다이얼로그가 그려질 자리를 마련합니다.

```tsx
// src/App.tsx
import { DialogsRenderer } from 'react-layered-dialog';
import { store } from '@/lib/dialogs';

function App() {
  return (
    <div>
      <MainContent />
      {/* 스토어와 연결된 렌더러 추가 */}
      <DialogsRenderer store={store} />
    </div>
  );
}
```

## 3단계: 다이얼로그 호출 및 구현

이제 어디서든 `dialog.confirm()`을 호출하여 다이얼로그를 열 수 있습니다.

### 호출부 (Caller)
```tsx
const result = await dialog.confirm({ 
  title: '인사', 
  message: '반가워요!' 
});

if (result.ok) {
  console.log('사용자가 확인을 눌렀습니다.');
}
```

### 다이얼로그 컴포넌트 (In-Component)
컴포넌트 내부에서는 `getProps` 메서드를 사용하여 초기 Props와 상태 값을 결합합니다.

```tsx
import { useDialogController } from 'react-layered-dialog';

export function ConfirmDialog(props) {
  const { getProps, close, resolve, zIndex } = useDialogController();
  
  // 초기 props와 내부 상태가 병합된 최종 데이터를 가져옵니다.
  const { title, message } = getProps(props);

  return (
    <div style={{ zIndex, background: 'white' }}>
      <h1>{title}</h1>
      <p>{message}</p>
      <button onClick={() => { resolve({ ok: true }); close(); }}>확인</button>
    </div>
  );
}
```

## 축하합니다!

이제 `react-layered-dialog`를 사용할 준비가 되었습니다. 더 깊이 있는 제어 방법이 궁금하다면 [기본 사용법 가이드](../guides/basic-usage.md)를 확인해 보세요.
