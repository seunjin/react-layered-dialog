import { AnimatePresence } from 'motion/react';
import { useDialogs } from '@/lib/dialogs';

/**
 * DialogRenderer 컴포넌트
 *
 * 이 컴포넌트는 `react-layered-dialog`의 핵심 렌더링 레이어입니다.
 * `useDialogs` 훅을 통해 현재 열려있는 모든 다이얼로그의 상태 배열(`dialogs`)을 구독합니다.
 *
 * `AnimatePresence` 컴포넌트는 다이얼로그가 열리고 닫힐 때 애니메이션 효과를 적용하기 위해 사용됩니다.
 * `AnimatePresence`가 자식의 추가/제거를 감지하려면, 자식 요소에 반드시 고유한 `key` prop이 있어야 합니다.
 *
 * `dialogs.map` 내부의 타입 추론 문제:
 * TypeScript는 `dialogs` 배열을 순회할 때, 각 요소의 `Component`와 `state`가 서로 짝이 맞는 타입이라는 것을
 * 완벽하게 추론하지 못하는 한계가 있습니다.
 */
export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <AnimatePresence>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </AnimatePresence>
  );
};