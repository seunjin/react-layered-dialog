# 기본 사용법 (Basic Usage)

이 가이드는 `react-layered-dialog`에서 가장 흔히 사용되는 동기 호출(`open`) 패턴과 다이얼로그의 기본적인 동작 원리를 다룹니다.

## 동기 다이얼로그 열기 (`open`)

`dialog.open()`은 호출 즉시 다이얼로그를 생성하고 해당 다이얼로그를 제어할 수 있는 **핸들(Handle)**을 반환합니다. 호출부에서 다이얼로그의 생명주기를 외부에서 제어해야 할 때 유용합니다.

### 간단한 사용 예시

```tsx
import { dialog } from '@/lib/dialogs';

function MyPage() {
  const handleOpen = () => {
    // 다이얼로그를 열고 핸들을 받음
    const result = dialog.open(({ close }) => (
      <div className="modal">
        <p>단순한 알림입니다.</p>
        <button onClick={close}>닫기</button>
      </div>
    ));

    // 필요 시 외부에서 3초 후 자동으로 닫기
    setTimeout(() => {
      result.close();
      result.unmount();
    }, 3000);
  };

  return <button onClick={handleOpen}>열기</button>;
}
```

## 다이얼로그 중첩 (Stacking)

여러 개의 다이얼로그를 연속해서 호출하면, 스토어는 내부에 스택 구조로 엔트리를 쌓습니다.

- **자동 z-index**: 각 다이얼로그는 열리는 순서대로 더 높은 `zIndex` 값을 할당받습니다.
- **포커스 유지**: 컴포넌트 내부에서 `useDialogController`의 `zIndex` 속성을 최상위 요소에 적용하면 레이어 순서가 자동으로 보장됩니다.

```tsx
function NestedExample() {
  const openFirst = () => {
    dialog.open(() => (
      <div className="first-layer">
        <button onClick={() => dialog.open(() => <div>두 번째 레이어</div>)}>
          또 열기
        </button>
      </div>
    ));
  };
}
```

## DialogsRenderer 레이아웃

`DialogsRenderer`는 포탈(Portal)과 유사하게 동작하지만, 스토어에 의해 중앙 관리됩니다. 보통 `App`의 루트 레벨에 배치하여 다이얼로그가 배경(Dim) 뒤로 숨지 않도록 합니다.

```tsx
// App.tsx
return (
  <main>
    <Routes />
    {/* 모든 다이얼로그는 여기서 그려집니다 */}
    <DialogsRenderer store={store} />
  </main>
);
```

## 닫기와 제거의 차이

라이브러리는 **'닫기(Close)'**와 **'제거(Unmount)'**를 엄격히 분리합니다.

1. **`close()`**: 다이얼로그의 상태를 `isOpen: false`로 바꿉니다. 이때 퇴장(Exit) 애니메이션이 시작되어야 합니다.
2. **`unmount()`**: 다이얼로그 엔트리를 스토어에서 완전히 삭제하여 DOM에서 제거합니다.

> [!TIP]
> 자세한 애니메이션 제어 방법은 [애니메이션 가이드](./animations.md)를 참고하세요.
