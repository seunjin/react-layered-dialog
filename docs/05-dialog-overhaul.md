# 5. 다이얼로그 개선 제안

이 문서는 `react-layered-dialog`의 현행 구조를 정리하고, 최근 논의된 개선·리뉴얼 아이디어를 기록합니다. 향후 상세 설계와 구현 순서를 논의할 때 참고용으로 활용합니다.

## 5.1 현재 구조 요약

- **상태 관리**: `DialogManager`가 다이얼로그 스택과 z-index를 관리합니다. `openDialog`, `closeDialog`, `updateDialog` API를 통해 상태를 조작합니다. (`package/src/core/manager.ts`)
- **렌더링 파이프라인**: `createUseDialogs`로 생성된 훅이 `dialogs` 배열(상관된 유니온)을 제공하고, 앱은 타입-컴포넌트 매핑을 등록합니다. (`package/src/core/factory.ts`)
- **공통 동작**: `useLayerBehavior` 훅이 ESC/외부 클릭 처리, 최상단 계산 등을 담당하며, 개별 다이얼로그 컴포넌트가 직접 호출합니다. (`package/src/hooks/useLayerBehavior.ts`)
- **예제 Confirm 패턴**: 예제 프로젝트에서는 `step` 상태를 다이얼로그 전역 상태로 유지하고 `updateDialog`로 갱신합니다. 실제 팀 프로젝트에서는 내부 `phase` 상태로 비동기 흐름을 처리하는 변형 패턴을 사용 중입니다.

## 5.2 발견된 문제점

- **비동기 Confirm 사용성**: 로딩/성공/실패 전이를 구현하려면 `updateDialog`를 다중 호출하거나 컴포넌트 내부에서 별도 상태 기계를 구현해야 합니다. 호출부 코드가 장황해지기 쉽습니다.
- **애니메이션 제약**: `closeDialog`가 곧바로 상태 배열에서 제거되기 때문에, 닫힘 애니메이션 후 언마운트를 제어하려면 추가 래퍼(예: `AnimatePresence`)가 필수입니다. 명시적인 `isOpen`/`isMounted` 분리가 없습니다.
- **고급 사용자 정의 난이도**: 공통 동작을 재사용하려면 매번 `useDialogs()`, `useLayerBehavior()`를 중복 작성해야 합니다. 베이스 레이아웃 컴포넌트가 없어 초기 진입 장벽이 있습니다.
- **Promise 기반 결과 전달 부재**: overlay-kit처럼 `openAsync`가 제공되지 않아 Confirm/Prompt 결과를 Promise로 처리하려면 별도 래퍼 함수를 작성해야 합니다.

## 5.3 비교 라이브러리 (overlay-kit)에서 얻은 인사이트

- 컨트롤러 함수에 `isOpen`, `close`, `unmount` 등을 넘겨 줘서 호출부가 JSX로 바로 선언할 수 있습니다.
- `openAsync`가 기본 제공되어 비동기 Confirm 흐름을 Promise로 자연스럽게 연결할 수 있습니다.
- `isOpen`과 `isMounted`를 분리 관리해 닫힘 애니메이션 후 언마운트를 제어합니다.
- 현재 최상단 오버레이 ID를 별도로 추적해 ESC 등 정책을 일원화합니다.

## 5.4 개선 아이디어 초안

1. **Promise 지원 API (`openDialogAsync`)**
   - 기존 타입 안전성을 유지하면서 결과를 `resolve`/`reject`로 반환하는 비동기 API 추가.
   - Confirm 컴포넌트는 Promise 반환을 감지해 로딩/성공 전환을 자동 처리하도록 개선.

2. **베이스 컴포넌트 (`DialogFrame`) 제공**
   - dim 처리, ESC/외부 클릭, 포커스 관리 등 공통 로직을 캡슐화.
   - 사용자는 `<DialogFrame><CustomBody /></DialogFrame>` 패턴으로 빠르게 커스텀 UI를 구성.

3. **닫힘/언마운트 분리**
   - `closeDialog`는 `isOpen=false`만 설정하고, `unmountDialog`(또는 자동 언마운트 정책)를 추가.
   - 애니메이션 완료 시점을 다이얼로그 컴포넌트가 결정할 수 있게 해 overlay-kit의 장점을 차용.

4. **JSX 기반 호출 확장 (`openDialogElement`)**
   - `openDialog`와 별도로 ReactNode를 직접 넘길 수 있는 API 검토.
   - 타입 안전성(현재의 상관된 유니온)과 병행 가능한지 사전 설계 필요.

5. **스택 상태 헬퍼**
   - 최상단 다이얼로그, 스크롤 락 여부 등을 반환하는 헬퍼/컨텍스트 추가.
   - `useLayerBehavior` 옵션 계산을 단순화하고 중복 코드를 줄임.

## 5.5 다음 논의 필요 항목

- 우선 구현할 항목 결정: (1) 비동기 Confirm 개선 vs (2) DialogFrame 도입 vs (3) close/unmount 구조 변경.
- API 변화에 따른 문서/예제 업데이트 범위 산정.
- 기존 사용자에게 미치는 영향과 마이그레이션 전략 검토.
- 테스트/스토리 확장 방안 (새 API에 대한 Vitest & 예제 추가).

---

이 문서는 논의가 진행될 때마다 업데이트합니다. 개선 아이디어가 확정되면 세부 설계 섹션을 추가하고, 구현 완료 시 최종 결론을 기록하세요.

## 5.6 설계 쟁점 메모

### Dialog 베이스 컴포넌트의 책임 범위
- 제공 여부: 선택형. 사용자는 직접 컨트롤러 props(`isOpen`, `close`, `unmount`)를 받아 Custom 컴포넌트를 구현할 수도 있음.
- 포함 로직: **도입하지 않음** (결정). dim, ESC, z-index 등 공통 동작도 사용자 컴포넌트에서 직접 처리하도록 한다.
- 제외 로직:
  - 애니메이션은 물론 dim/포커스 처리까지 완전히 open API로 제공한다.
  - 필요 시 별도 헬퍼를 만들 수는 있지만 라이브러리 기본 제공 컴포넌트는 목표하지 않음.

### 렌더러 구조
- 스택을 순회하며 등록된 컨트롤러 함수에 `{ isOpen, close, unmount, handle }`를 주입해 JSX를 생성.
- `createUseDialogs`의 컴포넌트 매핑 방식은 유지 가능. 새로운 JSX 기반 API는 별도 경로로 제공하고, 렌더러는 둘을 함께 처리하도록 설계.
- 닫힘/언마운트 분리를 도입하면 렌더러가 `isOpen`/`isMounted`를 보고 실제 제거 시점을 제어해야 함.

### 현재 합의 사항 요약
- 기본 `dialog.open`은 JSX를 직접 받도록 확장하며, 컴포넌트에는 비동기 함수나 로딩 상태(`isPending` 등)를 그대로 props로 전달해 UI를 제어한다.
- 모든 dim/ESC/스크롤락 등은 사용자 컴포넌트가 직접 구현하며, 필요 시 컨텍스트와 헬퍼 훅으로 보조한다.
- 렌더러는 기존 스택 관리 구조를 유지하되 `isOpen`/`unmount` 분리를 염두에 두고 제거 타이밍을 제어한다.
- `openDialogAsync`는 Promise 기반 결과 전달이 필요할 때만 선택적으로 사용하며, 최종 스펙은 추가 논의가 필요하다 (현재 스케치 상태).

### 컨텍스트 기반 JSX 호출 시나리오 예시
```tsx
// 1) dialog.open 호출부
dialog.open(<CustomPanel />);

// 2) 커스텀 패널 구현
function CustomPanel() {
  const { isOpen, close, unmount } = useDialogController(); // 컨텍스트로 컨트롤러 props 획득

  return (
    <AnimatePresence onExitComplete={unmount}>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* dim, ESC, 외부 클릭 등은 사용자 구현 */}
          ...
          <button onClick={close}>닫기</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```
- Provider는 `dialog.open(<CustomPanel />)` 호출 시 컨트롤러 props를 컨텍스트로 주입한다.
- dim, ESC, 외부 클릭, z-index 등 모든 동작은 `CustomPanel`이 직접 구현한다. 필요 시 헬퍼 훅을 제공하는 방향으로 확장 검토.

### 스크롤 락 처리 예시 (사용자 주도)
```tsx
function CustomPanel() {
  const { isOpen, close, unmount } = useDialogController();

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.dataset.scrollLockCount;
      const count = Number(prev ?? '0') + 1;
      document.body.dataset.scrollLockCount = String(count);
      document.body.classList.add('scroll-locked');
    } else {
      releaseScrollLock();
    }

    return () => releaseScrollLock();
  }, [isOpen]);

  function releaseScrollLock() {
    const prev = Number(document.body.dataset.scrollLockCount ?? '0');
    const next = Math.max(0, prev - 1);
    document.body.dataset.scrollLockCount = String(next);
    if (next === 0) {
      document.body.classList.remove('scroll-locked');
    }
  }

  return (
    <AnimatePresence onExitComplete={unmount}>
      {isOpen && (
        <motion.div>
          {/* 사용자 정의 dim/ESC 처리 */}
          ...
          <button onClick={close}>닫기</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 전역 CSS */
/*
body.scroll-locked {
  overflow: hidden;
}
*/
```
- 다이얼로그가 열릴 때 `data-scroll-lock-count`로 카운트를 유지하고, 0이 되면 `scroll-locked` 클래스를 제거합니다.
- 이 패턴은 사용자 컴포넌트가 직접 관리하며, 필요 시 헬퍼 훅으로 추상화할 수 있습니다.

### `useDialogController` 설계 스케치
```ts
// 컨텍스트 값 인터페이스
interface DialogControllerContextValue<TState> {
  handle: DialogHandle;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  closeAll: () => void;
  unmountAll: () => void;
  update: (patch: DialogPatch<TState> | ((prev: TState) => DialogPatch<TState> | null | undefined)) => void;
  stack: { topId: string | null; size: number; index: number };
  resolve?: (value: unknown) => void; // openAsync용
  reject?: (reason?: unknown) => void;
}

// 훅 시그니처
export function useDialogController<TState>() {
  const context = useContext(DialogControllerContext);
  if (!context) {
    throw new Error('useDialogController는 dialog.open으로 렌더링된 트리 내부에서만 사용할 수 있습니다.');
  }
  return context as DialogControllerContextValue<TState>;
}

// 사용 예시
function CustomPanel() {
  const { isOpen, close, unmount, closeAll, unmountAll, update } = useDialogController<MyState>();

  useEffect(() => {
    if (isOpen) {
      update((prev) => ({ ...prev, lastOpenedAt: new Date().toISOString() }));
    }
  }, [isOpen, update]);

  return (
    <div>
      ...
      <button onClick={close}>나만 닫기</button>
      <button onClick={closeAll}>모두 닫기</button>
      <button onClick={unmountAll}>모두 제거</button>
    </div>
  );
}
```
- `closeAll`, `unmountAll`도 컨트롤러에서 접근 가능하도록 포함.
- `update`는 상태 패치를 허용해 JSX 기반 호출에서도 상태 갱신이 가능하도록 설계.
- `stack` 정보는 최상단 여부 판단 등 고급 동작 구현에 활용할 수 있음.
- `resolve/reject`는 Promise 기반 API 도입 시 선택적으로 주입한다.

### `openDialogAsync` 사용 예시 (스케치)

> `openDialogAsync`의 세부 동작은 논의 중이며, 아래 코드는 값/패널 분리 가능성을 보여 주는 참고용 시나리오입니다.

```tsx
// 호출부
const handleDelete = async () => {
  const { handle, promise } = openDialogAsync<DeleteResponse>((controller) => (
    <CustomDeleteDialog controller={controller} categoryId={item.id} />
  ));

  const response = await promise; // mutate 응답
  await queryClient.invalidateQueries({ queryKey: ['categories'] });
  dialog.update(handle, {
    status: 'success',
    message: `"${response.categoryName}" 카테고리를 삭제했습니다.`,
  });
  dialog.close(handle.id);
};

// 패널 구현
type DeleteResponse = { categoryName: string };
type CustomDeleteDialogProps = {
  controller: DialogControllerContextValue<{ status: 'idle' | 'loading' | 'error' }>;
  categoryId: number;
};

function CustomDeleteDialog({ controller, categoryId }: CustomDeleteDialogProps) {
  const { isOpen, close, unmount, resolve, reject, update } = controller;

  const handleConfirm = async () => {
    update({ status: 'loading' });
    try {
      const result = await clientHttp.delete<{ response: DeleteResponse }>(
        `/api/categories/${categoryId}`
      );
      resolve?.(result.response); // 호출부 await가 응답 객체로 완료
      close(); // 다이얼로그 닫기 (선택)
    } catch (error) {
      update({ status: 'error' });
      reject?.(error);
    }
  };

  return (
    <AnimatePresence onExitComplete={unmount}>
      {isOpen && (
        <motion.div>
          <p>정말 삭제하시겠습니까?</p>
          <button onClick={handleConfirm}>삭제</button>
          <button
            onClick={() => {
              resolve?.(null); // 호출부가 null 처리 가능
              close();
            }}
          >
            취소
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```
- `openDialogAsync`는 컨트롤러에 `resolve`, `reject`를 주입해 Promise settle을 쉽게 처리할 수 있도록 한다.
- `close()` 호출 시 자동으로 `isOpen=false`가 되며, 애니메이션 종료 후 `unmount()`를 통해 제거한다.
- 필요 시 `update`를 통해 로딩/완료 상태를 패널 내부에서 관리할 수 있다.
