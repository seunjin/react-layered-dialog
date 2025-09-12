import type { DialogInstance } from 'react-layered-dialog';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

// 1. DialogRenderer를 제네릭 컴포넌트로 정의합니다.
// T는 AlertState | ConfirmState 같은 상태 유니온 타입입니다.
// props로 `DialogInstance<T>[]` 타입의 dialogs 배열을 받습니다.
export const DialogRenderer = <
  T extends { type: string; scrollLock?: boolean },
>({
  dialogs,
}: {
  dialogs: readonly DialogInstance<T>[];
}) => {
  const isScrollLocked = dialogs.some((dialog) => dialog.state.scrollLock);

  useEffect(() => {
    if (isScrollLocked) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }

    // 컴포넌트가 언마운트될 때를 대비해 정리(cleanup) 함수를 반환합니다.
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isScrollLocked]);

  return (
    <AnimatePresence>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </AnimatePresence>
  );
};
