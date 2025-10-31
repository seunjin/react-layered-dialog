# 리뉴얼 다이얼로그 스펙 정리

이 문서는 `react-layered-dialog` 리뉴얼 버전에서 확정된 스펙과 설계 결정을 요약합니다.

## 1. 상태 스토어
- 단일 스택 배열을 중앙에서 관리하며, 각 엔트리는 `id`, `component`, `isOpen`, `isMounted`, `controllerRefs` 등을 가진다.
- `close(id)`는 `isOpen=false`만 표시하고, 실제 제거는 `unmount(id)`가 수행한다.
- `closeAll()` / `unmountAll()`을 제공해 전체 다이얼로그 제어를 지원한다.
- 외부 구독은 `useSyncExternalStore` 기반으로 유지한다.
- 모든 다이얼로그가 제거되면 z-index 카운터(`nextZIndex`)가 `baseZIndex`로 리셋되어 다음 다이얼로그가 기본 값에서 다시 시작한다.

## 2. 렌더러
- 기존 렌더러 구조를 재사용하여 스택을 순회하며 JSX 컨트롤러 함수에서 반환한 엘리먼트를 렌더링한다.
- `isOpen`과 `isMounted` 분리 정책을 반영해 제거 타이밍을 제어한다.
- 각 엔트리에 컨트롤러 컨텍스트를 주입해 하위 컴포넌트가 `useDialogController()`로 제어 함수에 접근할 수 있게 한다.

## 3. `dialog.open`
- 시그니처: `dialog.open(node: React.ReactNode): DialogHandle`.
- JSX를 직접 받아 렌더링하며, 컴포넌트는 비즈니스 props(`isPending`, `onConfirm` 등)를 그대로 사용할 수 있다.
- 반환된 `DialogHandle`에는 `id`, `close()`, `unmount()`, `update()` 등의 편의 메서드를 포함한다.
- 옵션 객체를 함께 넘겨 추가 정책을 선언적으로 지정할 수 있다. (`{ zIndex, useDim, scrollLock, ... }`)

## 4. `dialog.openAsync`
- Promise 기반으로 결과를 반환하는 API. (세부 스펙은 조율 중)
- 컨트롤러에 `resolve`, `reject`를 주입해 패널에서 완료/실패 시점을 지정할 수 있게 한다.
- 반환 값에는 결과 객체(`ok`, `value`), 다이얼로그 제어 함수(`close`, `unmount`, `update`), 옵션 정보 등이 포함될 예정이다.
  ```tsx
  const result = await openDialogAsync<{ id: string }>((controller) => (
    <ConfirmDialog
      onConfirm={async () => {
        controller.update({ step: 'loading' });
        const response = await api.deleteItem(id);
        controller.resolve({ ok: true, value: response.id });
      }}
      onCancel={() => controller.resolve({ ok: false })}
    />
  ));

  if (!result.ok) return;

  toast.success('삭제되었습니다.');
  result.close();
  ```
- `reject(error)`는 Promise를 reject시키므로, 일반적인 취소 흐름에는 `resolve({ ok: false })`처럼 resolve 기반 패턴을 권장한다.

## 5. `useDialogController`
- 컨텍스트 훅으로, JSX 트리 내 어디에서나 `isOpen`, `close`, `unmount`, `closeAll`, `unmountAll`, `update`, `stack` 등에 접근할 수 있게 한다.
- 사용자가 dim, ESC, 스크롤락 등 모든 동작을 직접 구현하고 필요 시 헬퍼 훅으로 확장하는 방향을 권장한다.
- `update`는 객체를 전달하면 기존 상태와 병합하며, 초기에 state가 비어 있어도 자동으로 생성된다.
- `getStateField(key, fallback)` / `getStateFields(base)` 헬퍼를 제공해 `state`와 props를 손쉽게 병합할 수 있다.
- `options` 객체에는 호출 시 넘긴 값과 함께 최종 z-index가 항상 포함된다 (`options.zIndex`).
- 렌더러 함수에서 컨트롤러 메서드를 직접 props로 내려 공용 컴포넌트를 구성할 수 있다.
  ```tsx
  openDialog(({ update, unmount }) => (
    <NotificationDialog
      title="삭제 완료"
      message="카테고리를 삭제했습니다."
      onConfirm={() => update({ message: '다시 시도해주세요.' })}
      onClose={unmount}
    />
  ));
  ```

## 6. 기타
- 스크롤락은 사용자 구현에 맡기되, data-attribute나 `:has()` 예시를 문서로 제공한다.
- 기존 `createUseDialogs` 기반 타입 매핑 API는 리뉴얼 버전에서 제거할 계획이다.
- 현재는 실험 단계에서 `openRenewalDialog` 헬퍼를 사용하지만, 최종 목표는 `dialog.open(...)` / `dialog.openAsync(...)` 형태의 API를 제공해 `toast.success('...')`처럼 직관적인 사용 경험을 제공하는 것이다.

## 7. 비동기 흐름 패턴 예시

### 7.1 컨트롤러 객체를 클로저로 보관
```tsx
const controllerRef = useRef<DialogControllerContextValue<NotificationState> | null>(null);

const mutation = useMutation({
  mutationFn: deleteItem,
  onSuccess: () => {
    controllerRef.current?.update({
      message: '삭제가 완료되었습니다.',
      step: 'done',
    });
  },
  onSettled: () => controllerRef.current?.unmount(),
});

const handleOpen = () => {
  openDialog((controller) => {
    controllerRef.current = controller;
    return <NotificationDialog title="삭제 중" message="잠시만 기다려 주세요." />;
  });
};
```

### 7.2 반환된 handle을 통해 외부에서 업데이트
```tsx
const { handle } = openDialog(() => (
  <NotificationDialog title="삭제 중" message="잠시만 기다려 주세요." />
));

const mutation = useMutation({
  mutationFn: deleteItem,
  onSuccess: () => {
    updateDialog(handle.id, {
      message: '삭제가 완료되었습니다.',
      step: 'done',
    });
  },
  onSettled: () => unmountDialog(handle.id),
});
```

위 예시는 `example/src/lib/renewalDialogs.ts` 헬퍼(`openRenewalDialog`, `updateRenewalDialog`, `unmountRenewalDialog`)로 동일하게 적용할 수 있다. 향후 정식 API (`dialog.open`)에서도 동일한 패턴이 유지될 예정이다.

## 8. 옵션 기반 제어

`dialog.open` 호출 시 옵션 객체를 함께 넘기고, 다이얼로그 내부에서는 `useDialogController<State, Options>()`로 옵션을 안전하게 사용할 수 있다.

```tsx
type CounterOptions = { zIndex?: number; useDim?: boolean; scrollLock?: boolean };

openDialog<CounterState, CounterOptions>(
  () => <CounterDialog count={0} />,
  { zIndex: 1200, useDim: true, scrollLock: true }
);

function CounterDialog() {
  const { options, getStateFields } = useDialogController<CounterState, CounterOptions>();
  const { count } = getStateFields({ count: 0 });
  const dimmed = options.useDim ?? true;

  return (
    <div
      className={`fixed inset-0 ${dimmed ? 'bg-black/40' : 'bg-transparent'} flex items-center justify-center`}
      style={{ zIndex: options.zIndex ?? 0 }}
    >
      {/* ... */}
    </div>
  );
}
```

## 9. `dialog.open` vs `dialog.openAsync` 비교

| 항목 | `dialog.open` | `dialog.openAsync` *(예정)* |
| --- | --- | --- |
| 반환값 | `DialogHandle` (`id`, `componentKey`) | `Promise<DialogAsyncResult<T>>` (`ok`, `value`, `dialog`, `close`, `unmount`, `update`) |
| 주 사용처 | 단순 알림, 설정 UI 등 결과가 필요 없는 경우 | 확인 모달, 입력 후 후속 로직 등 결과가 필요한 비동기 흐름 |
| 다이얼로그 제어 | `dialog.close(handle.id)`, `dialog.update(handle.id, patch)` 등 전역 API 사용 | `result.close()`, `result.update(patch)` 등 반환 객체에 바로 포함 |
| 컨트롤러 메서드 | `update`, `close`, `unmount` | `resolve`, `reject`, `update` (reject는 예외 상황에 한해 사용) |
| 비즈니스 로직 위치 | 다이얼로그 내부 또는 호출부 자유롭게 분배 | 호출부가 `await` 이후에 일관된 흐름으로 이어가기 용이 |

두 API 모두 동일한 옵션 제네릭과 상태 헬퍼(`useDialogController<State, Options>()`)를 공유하므로, 상황에 맞춰 필요한 형태만 선택해서 사용하면 된다.

---

이 문서는 리뉴얼 진행 상황에 따라 계속 업데이트됩니다. 추가 결정 사항이나 변경점이 생기면 섹션을 확장하거나 조정하세요.
