import type { DialogInstance } from 'react-layered-dialog';
import { AnimatePresence } from 'motion/react';

// 1. DialogRenderer를 제네릭 컴포넌트로 정의합니다.
// T는 AlertState | ConfirmState 같은 상태 유니온 타입입니다.
// props로 `DialogInstance<T>[]` 타입의 dialogs 배열을 받습니다.
export const DialogRenderer = <T extends { type: string }>({
  dialogs,
}: {
  dialogs: readonly DialogInstance<T>[];
}) => {
  return (
    <AnimatePresence>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </AnimatePresence>
  );
};
