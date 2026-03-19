# v1.0.0 마이그레이션 가이드

v0에서 v1.0.0으로 업그레이드할 때 변경해야 할 사항을 정리합니다.

---

## Breaking Changes

### 1. 타입명 변경

| v0 이름 | v1 이름 | 위치 |
|---|---|---|
| `OpenDialogResult` | `DialogRef` | `store.open()` 반환 핸들의 `.ref` 필드 타입 |
| `DialogOpenResult` | `DialogHandle` | `store.open()` 반환 타입 전체 |

**v0 코드**

```ts
import { DialogOpenResult, OpenDialogResult } from 'react-layered-dialog';

const handle: DialogOpenResult = store.open(() => <MyDialog />);
const ref: OpenDialogResult = handle.dialog; // .dialog 필드
```

**v1 코드**

```ts
import { DialogHandle, DialogRef } from 'react-layered-dialog';

const handle: DialogHandle = store.open(() => <MyDialog />);
const ref: DialogRef = handle.ref; // .ref 필드
```

> [!NOTE]
> v0 이름(`OpenDialogResult`, `DialogOpenResult`)은 deprecated 별칭으로 유지됩니다. 즉시 빌드가 깨지지는 않지만, 차기 메이저 버전에서 제거될 예정이므로 마이그레이션을 권장합니다.

---

### 2. 핸들의 `.dialog` → `.ref` 필드명 변경

`store.open()` 반환값에서 다이얼로그 ID를 참조하는 필드명이 변경되었습니다.

**v0 코드**

```ts
const handle = store.open(() => <MyDialog />);
console.log(handle.dialog.id); // ❌
```

**v1 코드**

```ts
const handle = store.open(() => <MyDialog />);
console.log(handle.ref.id); // ✅
```

---

### 3. `useDialogController` — `handle` → `ref` 필드명 변경

`useDialogController()` 반환값 내부 필드명도 동일하게 변경되었습니다.

**v0 코드**

```tsx
const { handle } = useDialogController();
console.log(handle.id); // ❌
```

**v1 코드**

```tsx
const { ref } = useDialogController();
console.log(ref.id); // ✅
```

---

## 새로운 기능

### `useDialogStore(store)` 훅

스토어의 스냅샷을 React 컴포넌트에서 구독할 수 있습니다.

```tsx
import { useDialogStore } from 'react-layered-dialog';

const { entries } = useDialogStore(store);
const isAnyOpen = entries.some((e) => e.isOpen);
```

자세한 내용은 [useDialogStore 가이드](./guides/use-dialog-store.md)를 참고하세요.

---

### `store.isOpen(id)` 편의 메서드

특정 ID의 다이얼로그가 열려 있는지 확인합니다.

```ts
if (store.isOpen('confirm-dialog')) {
  // 이미 열려 있음
}
```

---

### `SyncDialogController` / `AsyncDialogController` 타입

다이얼로그 컴포넌트에 명시적 타입 어노테이션을 적용할 수 있습니다.

```tsx
import { SyncDialogController, AsyncDialogController } from 'react-layered-dialog';

// 동기 다이얼로그
const controller: SyncDialogController<AlertProps> = useDialogController<AlertProps>();

// 비동기 다이얼로그
const controller: AsyncDialogController<ConfirmProps, ConfirmData> = useDialogController<ConfirmProps>();
```

자세한 내용은 [타입 정의](./api/types.md)를 참고하세요.

---

### `resolve` 페이로드에 `data` 추가

비동기 다이얼로그에서 `ok` 외에 추가 데이터를 반환할 수 있습니다.

**v0 코드**

```tsx
resolve({ ok: true }); // ok만 가능
```

**v1 코드**

```tsx
resolve({ ok: true, data: { userId: '123' } }); // data 필드 추가

// 호출부
const result = await dialog.confirm({ message: '...' });
if (result.ok) {
  console.log(result.data?.userId);
}
```

---

### ID prefix 개선

`createDialogApi`로 등록한 다이얼로그는 레지스트리 키가 ID prefix로 사용됩니다.

```
v0: dialog-0, dialog-1
v1: confirm-0, alert-0, confirm-1 ...
```

---

## 빠른 마이그레이션 체크리스트

```
□ DialogOpenResult → DialogHandle 타입명 변경
□ OpenDialogResult → DialogRef 타입명 변경
□ handle.dialog.id → handle.ref.id 필드명 변경
□ useDialogController의 handle → ref 필드명 변경
□ (선택) SyncDialogController / AsyncDialogController 타입 적용
□ (선택) useDialogStore 훅 활용
□ (선택) resolve({ ok, data }) 데이터 페이로드 활용
```
