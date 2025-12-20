# useDialogController

다이얼로그 컴포넌트 내부에서 자신의 상태를 조회하고 조작하기 위해 사용하는 훅입니다.

## Signature
```ts
const controller = useDialogController<TProps>();
```

## 반환 값 (Controller Context)

### `getProps(initialProps)` 🟢 (New)
초기 props와 `update`를 통해 전달된 스토어의 현재 상태를 안전하게 병합하여 반환합니다.
- **권장 사항**: 컴포넌트 최상단에서 `const { title, message } = getProps(props);` 형태로 사용하세요.

### `getProp(key, fallback)` 🟢 (New)
특정 필드의 값 하나를 가져옵니다. 값이 없으면 fallback을 사용합니다.

### `close()`
현재 다이얼로그를 닫습니다. (상태 변화 트리거)

### `unmount()`
현재 다이얼로그를 DOM에서 제거합니다. 보통 애니메이션 종료 후에 호출합니다.

### `update(newProps)`
자신의 props를 직접 업데이트합니다.

### `setStatus(status)`
자신의 상태(`'loading'`, `'done'` 등)를 변경합니다.

### `resolve(data?)`
비동기 다이얼로그일 경우, 결과를 호출부(`openAsync`)에 전달하고 Promise를 종료합니다. `data` 인자를 통해 임의의 데이터를 넘길 수 있습니다.

### `reject(reason?)`
비동기 다이얼로그를 에러 상태로 종료합니다.

### `zIndex`
스토어에 의해 할당된 현재 다이얼로그의 적층 순서 값입니다. 최상위 요소의 스타일에 바인딩하세요.

## 레거시 별칭 (Backward Compatibility)
- `getStateFields`: `getProps`의 구버전 이름입니다.
- `getStateField`: `getProp`의 구버전 이름입니다.
