# DialogStore

`DialogStore`는 모든 다이얼로그의 상태를 중앙에서 관리하는 핵심 클래스입니다. `useSyncExternalStore`와 연동되어 React 컴포넌트에 상태 변화를 전파합니다.

## 생성자
```ts
const store = new DialogStore();
```

## 주요 메서드

### `open<TProps>(renderer, options?)`
다이얼로그를 즉시 엽니다.
- **매개변수**
  - `renderer`: `DialogRenderFn<TProps>` - 다이얼로그의 UI를 결정하는 함수입니다.
  - `options`: `OpenDialogOptions` - `id`, `props` 등을 지정할 수 있습니다.
- **반환값**: `DialogHandle<TProps>` (제어 핸들)

### `openAsync<TProps, TData>(renderer, options?)`
비동기 다이얼로그를 열고 사용자의 응답을 기다리는 Promise를 반환합니다.
- **매개변수**
  - `renderer`: `DialogRenderFn<TProps>`
  - `options`: `OpenDialogOptions`
- **반환값**: `Promise<DialogAsyncResult<TProps, TData>>`

### `update(id, props)`
열려 있는 특정 다이얼로그의 props를 업데이트합니다.

### `close(id)`
다이얼로그를 닫음 상태로 변경합니다. (실제 제거는 `unmount` 호출 시 이루어집니다.)

### `unmount(id)`
다이얼로그 엔트리를 스토어에서 완전히 제거합니다.

### `setStatus(id, status)`
다이얼로그의 메타 상태(`'idle' | 'loading' | 'done' | 'error'`)를 변경합니다.

## 상태 조회

### `getSnapshot()`
현재 스토어에 등록된 모든 다이얼로그 엔트리의 스냅샷을 반환합니다.

### `getStatus(id)`
특정 다이얼로그의 현재 상태를 반환합니다.

### `isOpen(id)`
특정 ID의 다이얼로그가 현재 열려 있는지 여부를 `boolean`으로 반환합니다.

## React 연동

### `useDialogStore(store)`
React 컴포넌트 내에서 스토어 상태를 구독하는 훅입니다. 스토어의 스냅샷이 변경될 때마다 컴포넌트를 리렌더링합니다. 내부적으로 `useSyncExternalStore`를 사용합니다.
```ts
const snapshot = useDialogStore(store);
```
