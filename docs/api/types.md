# 타입 정의 (Types)

라이브러리에서 사용하는 핵심 타입과 인터페이스 모음입니다.

---

## DialogStatus

다이얼로그의 처리 상태를 나타냅니다.

```ts
type DialogStatus = 'idle' | 'loading' | 'done' | 'error';
```

| 값 | 의미 |
|---|---|
| `'idle'` | 기본 상태 |
| `'loading'` | 비동기 처리 중 (버튼 비활성화, 스피너 등) |
| `'done'` | 처리 완료 |
| `'error'` | 오류 발생 |

---

## DialogRef

열린 다이얼로그를 식별하는 참조 정보입니다. `DialogHandle.ref` 필드로 제공됩니다.

```ts
type DialogRef = {
  id: string;           // 다이얼로그 고유 ID (예: "confirm-0")
  componentKey: string; // 렌더링 키
};
```

---

## DialogHandle\<TProps\>

`store.open()` 또는 `createDialogApi`의 sync 메서드 호출 시 반환되는 제어 핸들입니다.

```ts
type DialogHandle<TProps> = {
  ref: DialogRef;
  close: () => void;
  unmount: () => void;
  update: (updater: TProps | Partial<TProps> | ((prev: TProps) => Partial<TProps>)) => void;
  setStatus: (status: DialogStatus) => void;
  getStatus: () => DialogStatus;
  status: DialogStatus;
  zIndex: number;
  getProp: <V>(key: keyof TProps, fallback: V) => V;
  getProps: <T extends Record<string, unknown>>(base: T) => T;
};
```

### 사용 예시

```tsx
const handle = store.open(() => <ProgressDialog percent={0} />);

// 외부에서 진행률 업데이트
api.onProgress((p) => {
  handle.update({ percent: p });
});

// 완료 후 닫기
handle.setStatus('done');
setTimeout(() => handle.unmount(), 500);

// ID 확인
console.log(handle.ref.id); // "dialog-0"
```

---

## DialogAsyncResult\<TProps, TData\>

`store.openAsync()` 또는 `createDialogApi`의 async 메서드가 resolve할 때 반환하는 타입입니다. `DialogHandle`을 확장합니다.

```ts
type DialogAsyncResult<TProps, TData> = DialogHandle<TProps> & {
  ok: boolean;
  data?: TData;
};
```

### 사용 예시

```tsx
const result = await store.openAsync<{ message: string }, { userId: string }>(
  () => <SelectUserDialog message="담당자를 선택하세요" />
);

if (result.ok) {
  console.log(result.data?.userId); // 선택된 사용자 ID
}
```

---

## SyncDialogController\<TProps\>

**동기** 다이얼로그 컴포넌트에서 `useDialogController()`의 반환값에 타입을 명시할 때 사용합니다. `resolve`/`reject`가 없음을 타입 수준에서 보장합니다.

```ts
type SyncDialogController<TProps> = Omit<
  DialogControllerContextValue<TProps>,
  'resolve' | 'reject'
>;
```

### 사용 예시

```tsx
import { useDialogController, SyncDialogController } from 'react-layered-dialog';

type AlertProps = { title: string; message: string };

function AlertDialog(props: AlertProps) {
  const controller: SyncDialogController<AlertProps> =
    useDialogController<AlertProps>();

  const { title, message } = controller.getProps(props);

  return (
    <div style={{ zIndex: controller.zIndex }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={controller.close}>확인</button>
    </div>
  );
}
```

---

## AsyncDialogController\<TProps, TData\>

**비동기** 다이얼로그 컴포넌트에서 `useDialogController()`의 반환값에 타입을 명시할 때 사용합니다. `resolve`와 `reject`가 반드시 존재함을 보장합니다.

```ts
type AsyncDialogController<TProps, TData> = Omit<
  DialogControllerContextValue<TProps>,
  'resolve' | 'reject'
> & {
  resolve: (payload: { ok: boolean; data?: TData }) => void;
  reject: (reason?: unknown) => void;
};
```

### 사용 예시

```tsx
import { useDialogController, AsyncDialogController } from 'react-layered-dialog';

type ConfirmProps = { message: string };
type ConfirmData = { confirmed: boolean };

function ConfirmDialog(props: ConfirmProps) {
  const { resolve, close, getProps }: AsyncDialogController<ConfirmProps, ConfirmData> =
    useDialogController<ConfirmProps>();

  const { message } = getProps(props);

  return (
    <div>
      <p>{message}</p>
      <button onClick={() => { resolve({ ok: true }); close(); }}>확인</button>
      <button onClick={() => { resolve({ ok: false }); close(); }}>취소</button>
    </div>
  );
}
```

> [!TIP]
> `SyncDialogController` / `AsyncDialogController`는 선택적으로 사용합니다. `useDialogController()`의 반환값을 그대로 사용해도 동작에는 차이가 없지만, 명시적 타입 어노테이션을 원할 때 유용합니다.

---

## DialogRenderFn\<TProps\>

다이얼로그를 어떻게 렌더링할지 정의하는 함수 타입입니다. `store.open()` 등의 첫 번째 인자로 사용됩니다.

```ts
type DialogRenderFn<TProps> = (
  controller: DialogControllerContextValue<TProps>
) => ReactNode;
```

---

## DialogConfig

`createDialogApi`에서 각 항목을 설정할 때 사용하는 타입입니다.

```ts
type DialogConfig = {
  component: ComponentType<any>; // 렌더링할 React 컴포넌트
  mode?: 'sync' | 'async';       // 기본값: 'sync'
  defaultProps?: Record<string, unknown>;
  id?: string;                   // 명시적 ID (미지정 시 자동 생성)
};
```

---

## Deprecated 타입 (v0 호환)

아래 타입은 v1에서 새 이름으로 리네임되었습니다. 기존 코드 호환을 위해 `deprecated` 별칭이 유지되지만, 향후 메이저 버전에서 제거될 예정입니다.

| 구 이름 | 새 이름 | 비고 |
|---|---|---|
| `OpenDialogResult` | `DialogRef` | `open()`의 ref 정보 |
| `DialogOpenResult` | `DialogHandle` | `open()`의 반환 핸들 |
