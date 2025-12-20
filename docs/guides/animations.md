# 애니메이션과 함께 다이얼로그 닫기 (Animations & Unmounting)

`react-layered-dialog`는 **Headless** 철학을 따릅니다. 이는 라이브러리가 UI의 상태(열림/닫힘)만을 관리하고, 실제 애니메이션이나 DOM 제거 시점은 개발자가 완전히 제어하도록 설계되었음을 의미합니다.

## 핵심 개념: 책임의 분리

- **`close()`**: 다이얼로그의 `isOpen` 상태를 `false`로 바꿉니다. 이는 **애니메이션의 시작점**이 됩니다.
- **`unmount()`**: 다이얼로그를 스택에서 영구히 제거합니다. 이는 **애니메이션의 종료점**이 되어야 합니다.

이 두 단계를 분리함으로써, 사용자는 복잡한 애니메이션 시나리오에서도 100% 제어권을 가집니다.

---

## 1. CSS Transition/Animation 연동

CSS를 사용하는 경우 `onTransitionEnd` 또는 `onAnimationEnd` 이벤트를 사용하여 애니메이션이 끝나는 시점에 `unmount()`를 호출합니다.

```tsx
const MyDialog = () => {
  const { isOpen, unmount, close, zIndex } = useDialogController();

  return (
    <div
      style={{
        zIndex,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
      onTransitionEnd={() => {
        if (!isOpen) {
          unmount(); // 애니메이션이 끝나고 닫힌 상태라면 DOM에서 제거
        }
      }}
    >
      <p>내용</p>
      <button onClick={close}>닫기</button>
    </div>
  );
};
```

## 2. Framer Motion 연동 (권장)

Framer Motion과 같은 라이브러리를 사용하면 `AnimatePresence`의 `onExitComplete` 기능을 통해 훨씬 깔끔하게 연동할 수 있습니다.

```tsx
import { motion, AnimatePresence } from 'framer-motion';

const MyDialog = () => {
  const { isOpen, unmount, close, zIndex } = useDialogController();

  return (
    <AnimatePresence onExitComplete={unmount}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex }}
        >
          <p>내용</p>
          <button onClick={close}>닫기</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

## 3. 왜 인위적인 `delay`보다 이 방식이 좋은가요?

사용자가 `close({ delay: 300 })` 처럼 인위적인 시간을 주는 방식은 다음과 같은 문제점이 있습니다:

1. **불일치**: CSS 애니메이션 시간을 350ms로 수정하면, JS의 delay 값도 매번 수동으로 맞춰야 합니다.
2. **버벅임**: 애니메이션은 끝났는데 DOM이 늦게 사라지거나, 반대로 애니메이션 도중에 DOM이 사라져 깜빡이는 현상이 발생할 수 있습니다.
3. **유연성 부족**: 여러 요소가 순차적으로 닫히는 복잡한 시퀀스를 제어하기 어렵습니다.

이벤트 기반의 `unmount()` 호출 패턴을 사용하면 애니메이션 시간과 상관없이 **항상 자연스러운 종료 시점**을 보장받을 수 있습니다.
