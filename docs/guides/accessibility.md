# 접근성 가이드 (Accessibility)

`react-layered-dialog`는 헤드리스(Headless) 라이브러리로서 마크다운과 스타일링은 개발자에게 맡기지만, 모든 사용자가 다이얼로그를 원활하게 사용할 수 있도록 접근성(A11y) 표준을 준수하는 것을 강력히 권장합니다.

## WAI-ARIA 속성

다이얼로그의 의미를 스크린 리더에 정확히 전달하기 위해 다음 속성들을 적용하세요.

- **`role="dialog"`**: 해당 요소가 다이얼로그임을 선언합니다.
- **`aria-modal="true"`**: 다이얼로그 아래의 콘텐츠가 비활성 상태임을 알립니다.
- **`aria-labelledby`**: 다이얼로그의 제목 요소를 가리킵니다.
- **`aria-describedby`**: 다이얼로그의 설명을 가리킵니다.

```tsx
function MyDialog(props) {
  const { zIndex } = useDialogController();
  const id = useId();

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby={`${id}-title`}
      style={{ zIndex }}
    >
      <h2 id={`${id}-title`}>{props.title}</h2>
      {/* ... */}
    </div>
  );
}
```

## 포커스 트랩 (Focus Trap)

다이얼로그가 열려 있는 동안 포커스가 다이얼로그 외부에 머물지 않도록 제어해야 합니다. `react-focus-lock` 등을 활용하거나 직접 구현하여 다음을 보장하세요:

1. 다이얼로그가 열리면 첫 번째 대화형 요소에 초점을 맞춥니다.
2. `Tab` 키를 누르면 다이얼로그 내부에서만 포커스가 순환합니다.
3. 다이얼로그가 닫히면 열기 전 포커스가 있었던 요소로 초점을 되돌립니다.

## 키보드 인터랙션

사용자가 키보드만으로 다이얼로그를 조작할 수 있도록 구현해야 합니다.

- **ESC 키**: 다이얼로그를 닫습니다. `useDialogController`의 `close`를 호출하세요.
- **포커스 유지**: 다이얼로그 스택이 쌓일 때 가장 위에 있는 다이얼로그가 항상 포커스를 가져야 합니다.

```tsx
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, [close]);
```

> [!TIP]
> `react-layered-dialog`는 `DialogsRenderer`를 통해 DOM 순서를 관리하므로, 스택의 순서와 탭(Tab) 순서가 일치하여 접근성을 구현하기에 매우 유리한 구조를 가지고 있습니다.
