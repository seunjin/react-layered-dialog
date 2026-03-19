# useDialogStore 가이드

`useDialogStore`는 스토어의 상태 변화를 React 컴포넌트에서 구독할 수 있게 해주는 훅입니다. 열린 다이얼로그 목록, 각 항목의 `isOpen` 상태, z-index 등 스냅샷 전체에 접근할 수 있습니다.

## 기본 사용법

```tsx
import { useDialogStore } from 'react-layered-dialog';
import { store } from './lib/dialogs';

function MyComponent() {
  const { entries } = useDialogStore(store);

  return <div>열린 다이얼로그 수: {entries.filter((e) => e.isOpen).length}</div>;
}
```

`entries`는 현재 스토어에 마운트된 모든 다이얼로그 엔트리의 배열입니다. 스토어 상태가 바뀔 때마다 컴포넌트가 자동으로 리렌더링됩니다.

---

## 대표 활용 패턴

### 1. 오버레이 배경 (Backdrop)

다이얼로그가 하나라도 열려 있을 때 반투명 배경을 표시하는 패턴입니다.

```tsx
function Backdrop() {
  const { entries } = useDialogStore(store);
  const isAnyOpen = entries.some((e) => e.isOpen);

  return (
    <div
      className="backdrop"
      style={{
        opacity: isAnyOpen ? 1 : 0,
        pointerEvents: isAnyOpen ? 'auto' : 'none',
        transition: 'opacity 0.2s',
      }}
    />
  );
}
```

> [!TIP]
> `DialogsRenderer` 바깥에 `Backdrop`을 배치하면 z-index 관리가 훨씬 간단해집니다.

### 2. 다이얼로그 카운터

```tsx
function DialogCounter() {
  const { entries } = useDialogStore(store);

  return (
    <span>
      {entries.filter((e) => e.isOpen).length}개 열림
    </span>
  );
}
```

### 3. 특정 다이얼로그 상태 감시

```tsx
function ConfirmWatcher() {
  const { entries } = useDialogStore(store);
  const confirmEntry = entries.find((e) => e.id === 'my-confirm');

  if (!confirmEntry) return null;

  return (
    <div>
      상태: {confirmEntry.status} / 열림: {String(confirmEntry.isOpen)}
    </div>
  );
}
```

### 4. 스크롤 잠금 (Body Scroll Lock)

다이얼로그가 열려 있는 동안 페이지 스크롤을 막는 패턴입니다.

```tsx
function ScrollLockManager() {
  const { entries } = useDialogStore(store);
  const isAnyOpen = entries.some((e) => e.isOpen);

  useEffect(() => {
    document.body.style.overflow = isAnyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isAnyOpen]);

  return null;
}
```

---

## `isOpen` vs `entries.length`

| 조건 | 설명 |
|---|---|
| `entries.length > 0` | 마운트된 다이얼로그가 존재함 (애니메이션 중 포함) |
| `entries.some((e) => e.isOpen)` | 실제로 "열린" 다이얼로그가 존재함 |

`close()`가 호출되면 `isOpen`이 `false`로 바뀌지만, `unmount()` 전까지 엔트리는 스택에 남아 있습니다. 퇴장 애니메이션을 처리할 때 이 차이를 활용합니다.

---

## 멀티 스토어 환경

여러 스토어를 운영하는 경우 각각 독립적으로 구독합니다.

```tsx
const { entries: mainEntries } = useDialogStore(mainStore);
const { entries: sidebarEntries } = useDialogStore(sidebarStore);
```

---

## 참고

- [DialogStore API](../api/dialog-store.md)
- [다중 스토어](../advanced/multiple-stores.md)
