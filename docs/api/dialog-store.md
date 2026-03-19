# DialogStore

`DialogStore`는 모든 다이얼로그의 상태를 중앙에서 관리하는 핵심 클래스입니다. `useSyncExternalStore`와 연동되어 React 컴포넌트에 상태 변화를 전파합니다.

## 생성자

```ts
const store = new DialogStore(options?: { baseZIndex?: number });
```

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `baseZIndex` | `number` | `1000` | 첫 번째 다이얼로그의 z-index 시작값 |

---

## 다이얼로그 열기

### `open<TProps>(renderer, options?)`

다이얼로그를 즉시 열고 `DialogHandle`을 반환합니다.

```ts
const handle = store.open(renderer, options?);
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `renderer` | `DialogRenderFn<TProps>` | 다이얼로그 UI를 반환하는 함수 |
| `options.id` | `string` | 명시적 ID 지정 (미지정 시 자동 생성) |
| `options.zIndex` | `number` | z-index 직접 지정 |

```tsx
const handle = store.open(() => <AlertDialog message="저장되었습니다." />);

handle.close();          // isOpen = false (애니메이션 트리거)
handle.unmount();        // DOM에서 완전히 제거
handle.update({ message: '업데이트됨' });
handle.setStatus('loading');
console.log(handle.ref.id); // "dialog-0"
```

### `openAsync<TProps, TData>(renderer, options?)`

비동기 다이얼로그를 열고 사용자 응답을 기다리는 Promise를 반환합니다.

```ts
const result = await store.openAsync(renderer, options?);
```

- 다이얼로그 내부에서 `resolve({ ok, data? })` 호출 시 Promise가 fulfill됩니다.
- `unmount()` / `unmountAll()` 호출 시 Promise가 자동으로 reject됩니다.

```tsx
const result = await store.openAsync<{ message: string }, { userId: string }>(
  () => <SelectUserDialog message="담당자를 선택하세요" />
);

if (result.ok) {
  console.log(result.data?.userId);
}
```

---

## 다이얼로그 제어

### `close(id?)`

다이얼로그를 닫힘 상태로 변경합니다. `id` 미지정 시 스택 최상단 다이얼로그에 적용됩니다.

> DOM에서 즉시 제거하지 않으므로, 애니메이션 종료 후 `unmount()`를 호출해야 합니다.

### `unmount(id?)`

다이얼로그를 스토어와 DOM에서 완전히 제거합니다. `id` 미지정 시 스택 최상단에 적용됩니다.

### `closeAll()`

스택에 있는 모든 다이얼로그를 닫힘 상태로 변경합니다.

### `unmountAll()`

스택에 있는 모든 다이얼로그를 즉시 제거합니다. 진행 중인 async 다이얼로그는 자동으로 reject됩니다.

### `update(id, updater)`

열려 있는 다이얼로그의 props를 업데이트합니다.

```tsx
// 객체로 업데이트
store.update('confirm-0', { message: '정말 삭제하시겠습니까?' });

// 함수로 업데이트 (이전 상태 기반)
store.update('confirm-0', (prev) => ({ count: prev.count + 1 }));
```

### `setStatus(id, status)`

다이얼로그의 메타 상태를 변경합니다.

```tsx
store.setStatus('confirm-0', 'loading');
```

---

## 상태 조회

### `isOpen(id)`

특정 ID의 다이얼로그가 현재 열려 있는지 확인합니다.

```tsx
if (store.isOpen('confirm-0')) {
  // 이미 열려 있음
}
```

### `getStatus(id)`

특정 다이얼로그의 현재 `DialogStatus`를 반환합니다.

### `getSnapshot()`

현재 스토어에 등록된 모든 다이얼로그 엔트리 배열의 스냅샷을 반환합니다.

---

## React 연동

### `useDialogStore(store)`

React 컴포넌트 내에서 스토어 상태를 구독하는 훅입니다. 스냅샷이 변경될 때마다 컴포넌트를 리렌더링합니다. 내부적으로 `useSyncExternalStore`를 사용합니다.

```ts
const snapshot = useDialogStore(store);
// snapshot.entries: DialogEntry[]
```

**활용 예시 — 오버레이 배경 표시**

```tsx
import { useDialogStore } from 'react-layered-dialog';

function BackdropLayer() {
  const { entries } = useDialogStore(store);
  const isAnyOpen = entries.some((e) => e.isOpen);

  return isAnyOpen ? <div className="backdrop" /> : null;
}
```

자세한 활용법은 [useDialogStore 가이드](../guides/use-dialog-store.md)를 참고하세요.
