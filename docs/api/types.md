# 타입 정의 (Types)

라이브러리에서 사용하는 핵심 타입과 인터페이스 모음입니다.

## DialogStatus
다이얼로그의 처리 상태를 나타냅니다.
```ts
type DialogStatus = 'idle' | 'loading' | 'done' | 'error';
```

## DialogOpenResult<TProps>
`open` 메서드 호출 시 반환되는 제어 핸들 객체입니다.
- `dialog`: 엔트리 정보
- `close()`: 닫기
- `unmount()`: 제거
- `update(props)`: 상태 업데이트
- `setStatus(status)`: 상태 변경
- `getStatus()`: 현재 상태 조회
- `zIndex`: 적층 순서

## DialogAsyncResult<TProps, TData>
비동기 호출 성공 시 Promise가 반환하는 값입니다. `DialogOpenResult`에 다음이 추가됩니다.
- `ok`: `boolean` (resolve 시 전달된 성공 여부)
- `data`: `TData` (resolve 시 전달된 사용자 데이터)

## DialogRenderFn<TProps>
다이얼로그를 어떻게 그릴지 정의하는 함수 타입입니다.
```ts
type DialogRenderFn<P> = (controller: DialogControllerContextValue<P>) => ReactNode;
```

## DialogConfig
`createDialogApi`에서 각 엔트리를 설정할 때 사용하는 타입입니다.
- `component`: React 컴포넌트
- `mode?`: `'sync' | 'async'`
- `defaultProps?`: 초기 Props
- `id?`: 명시적 ID
