import { AnimatePresence } from 'motion/react';
import { useDialogs } from '@/lib/dialogs';

/**
 * DialogRenderer 컴포넌트
 *
 * 이 컴포넌트는 `react-layered-dialog`의 핵심 렌더링 레이어입니다.
 * `useDialogs` 훅을 통해 현재 열려있는 모든 다이얼로그의 상태 배열(`dialogs`)을 구독합니다.
 *
 * `dialogs` 배열에는 렌더링에 필요한 모든 정보가 담겨 있습니다:
 * - `Component`: `dialogs.ts`의 `componentMap`에 따라 매핑된 실제 React 컴포넌트입니다.
 * - `state`: 다이얼로그에 전달될 `props` 객체입니다. (`id`, `zIndex` 포함)
 *
 * `AnimatePresence` 컴포넌트는 다이얼로그가 열리고 닫힐 때 애니메이션 효과를 적용하기 위해 사용됩니다.
 *
 * 이 컴포넌트를 앱의 최상위 레이아웃 (예: `App.tsx`)에 한 번만 포함시키면,
 * 라이브러리가 모든 다이얼로그 렌더링을 자동으로 관리합니다.
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