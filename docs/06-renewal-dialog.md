# 다이얼로그 API 스펙 정리

이 문서는 `react-layered-dialog`의 최신 다이얼로그 스펙과 설계 결정을 요약합니다.

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
- 시그니처: `dialog.open(node: React.ReactNode): DialogOpenResult`.
- JSX를 직접 받아 렌더링하며, 컴포넌트는 비즈니스 props(`isPending`, `onConfirm` 등)를 그대로 사용할 수 있다.
- 반환된 객체에는 `close()`, `unmount()`, `update()`, `setStatus()` 등 동일 ID를 제어할 수 있는 메서드가 포함된다.
- 옵션 객체를 함께 넘겨 추가 정책을 선언적으로 지정할 수 있다. (`{ zIndex, useDim, scrollLock, ... }`)

## 4. `dialog.openAsync`
- Promise 기반으로 결과를 반환하는 API.
- 컨트롤러에는 `resolve`, `reject`, `handle`이 주입되어 패널 내부에서 비동기 흐름을 직접 제어할 수 있다.
- `await` 결과는 `DialogAsyncResult<TProps, TOptions>` 형태이며 다음 필드를 포함한다.
  - `ok`: 컨트롤러에서 전달한 승인 여부 (true/false)
  - `dialog`: `{ id, componentKey }` 형태의 다이얼로그 핸들
  - `close()`, `unmount()`, `update()`, `setStatus(status)`: 동일 ID를 대상으로 한 제어 함수
  - `status`: `'idle' | 'loading' | 'done' | 'error'` 중 현재 상태
  - `options`: 최종 옵션 (`zIndex` 포함)
- 호출부에서는 보통 `dialog.openAsync()`처럼 호출하며, 옵션 타입은 전달한 객체 리터럴로 자동 추론된다.
- 컨트롤러에서 `resolve({ ok })`를 호출하면 Promise가 resolve되며, 다이얼로그를 닫는 시점은 호출부 또는 컨트롤러가 선택한다.
- `reject(error)`는 Promise를 reject시키므로 네트워크 오류 등 예외 상황에서만 사용하고, 일반 취소 흐름은 `resolve({ ok: false })` 패턴을 권장한다.
  ```tsx
  const result = await renewalDialog.confirm((controller) => ({
    title: '정말 삭제할까요?',
    message: '이 동작은 되돌릴 수 없습니다.',
    confirmLabel: '삭제',
    cancelLabel: '취소',
    onConfirm: () => controller.resolve?.({ ok: true }),
    onCancel: () => controller.resolve?.({ ok: false }),
  }), { dimmed: true });

  if (!result.ok) return; // resolve({ ok: false })

  toast.success(`다이얼로그 ${result.dialog.id} 완료`);
  ```
- 전체 흐름은 `example/src/pages/renewal/Renewal.tsx` 페이지의 `RenewalConfirm` 사용 예제를 참고하면 된다.

## 5. `useDialogController`
- 컨텍스트 훅으로, JSX 트리 내 어디에서나 `isOpen`, `close`, `unmount`, `closeAll`, `unmountAll`, `update`, `setStatus`, `status`(`'idle' | 'loading' | 'done' | 'error'`), `stack` 등에 접근할 수 있게 한다.
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
- 기존 `createUseDialogs` 기반 타입 매핑 API는 단계적으로 제거할 계획이다.
- 예제 앱에서는 임시로 `renewalDialog` 헬퍼를 사용하지만, 최종 목표는 `dialog.open(...)` / `dialog.openAsync(...)` 형태의 API를 제공해 `toast.success('...')`처럼 직관적인 사용 경험을 제공하는 것이다.

## 7. 등록 헬퍼(`defineDialog`)와 모드 선택

- 레지스트리는 다음 두 가지 방식 중 하나로 등록할 수 있습니다.
  ```ts
  // 1) 간단한 객체 방식 (권장)
  const registry = {
    alert: { component: AlertDialog }, // mode 기본값: 'sync'
    confirm: { component: ConfirmDialog, mode: 'async' },
  } as const;

  // 2) 세밀한 제어가 필요할 때
  const registry = {
    alert: defineDialog(AlertDialog),
    confirm: defineDialog(ConfirmDialog, { mode: 'async', displayName: 'ConfirmDialog' }),
  } as const;
  ```
- `defineDialog(Component)`는 기본적으로 `open` 기반의 동기 다이얼로그를 정의합니다.
- Promise 기반이 필요한 경우 `defineDialog(Component, { mode: 'async' })`처럼 명시해 `openAsync` 흐름을 사용하도록 등록할 수 있습니다.
- 레지스트리에 등록된 항목은 `createDialogApi`로 묶으면 `renewalDialog.confirm()`처럼 고수준 메서드가 생성되며, 동기/비동기 모드는 정의 시점의 설정을 따릅니다.
- 예시:
  ```ts
  const registry = {
    alert: defineDialog(AlertDialog), // 동기
    confirm: defineDialog(ConfirmDialog, { mode: 'async' }), // 비동기
  } as const;
  ```

## 8. 비동기 흐름 패턴 예시

### 8.1 컨트롤러 객체를 클로저로 보관
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

### 8.2 반환된 handle을 통해 외부에서 업데이트
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

### 8.3 `openAsync`로 확인 모달 처리
```tsx
const handleDelete = async () => {
  const result = await renewalDialog.confirm((controller) => ({
    title: '정말 삭제할까요?',
    message: '이 작업은 되돌릴 수 없습니다.',
    confirmLabel: '삭제',
    cancelLabel: '취소',
    onConfirm: () => controller.resolve?.({ ok: true }),
    onCancel: () => controller.resolve?.({ ok: false }),
  }), { dimmed: true });

  if (!result.ok) return; // resolve({ ok: false })

  result.setStatus('loading');
  await api.deleteItem();
  result.setStatus('done');
  result.update({ step: 'done', note: '서버 삭제가 완료되었습니다.' });
  result.close();
  setTimeout(() => result.unmount(), 200);

  toast.success(`다이얼로그 ${result.dialog.id} 처리 완료!`);
};
```

위 예시는 `example/src/lib/renewalDialogs.ts` 헬퍼(`renewalDialog.confirm`, `renewalDialog.open`, `renewalDialog.update`)로 그대로 재현할 수 있다. 향후 정식 API (`dialog.confirm`, `dialog.open`)에서도 동일한 패턴이 유지될 예정이다.

## 9. 옵션 기반 제어

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

## 10. `dialog.open` vs `dialog.openAsync` 비교

| 항목 | `dialog.open` | `dialog.openAsync` |
| --- | --- | --- |
| 반환값 | `DialogOpenResult<TProps, TOptions>` | `Promise<DialogAsyncResult<TProps, TOptions>>` |
| 주 사용처 | 단순 알림, 설정 UI 등 결과가 필요 없는 경우 | 확인 모달, 입력 후 후속 로직 등 결과가 필요한 비동기 흐름 |
| 다이얼로그 제어 | `dialog.close(handle.id)`, `dialog.update(handle.id, patch)` 등 전역 API 사용 | `result.close()`, `result.unmount()`, `result.update(patch)`을 결과 객체에서 직접 사용 |
| 컨트롤러 메서드 | `update`, `close`, `unmount` | `resolve`, `reject`, `update`, `handle` (reject는 예외 상황에서만 사용 권장) |
| 추가 데이터 | - | `result.dialog`(핸들), `result.options.zIndex` 등 후속 로직에 필요한 정보 제공 |

두 API 모두 동일한 옵션 제네릭과 상태 헬퍼(`useDialogController<State, Options>()`)를 공유하므로, 상황에 맞춰 필요한 형태만 선택해서 사용하면 된다.

---

이 문서는 리뉴얼 진행 상황에 따라 계속 업데이트됩니다. 추가 결정 사항이나 변경점이 생기면 섹션을 확장하거나 조정하세요.
