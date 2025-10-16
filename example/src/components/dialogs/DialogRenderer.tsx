import type { DialogInstance } from 'react-layered-dialog';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

export const DialogRenderer = <T extends { type: string }>({
  dialogs,
}: {
  dialogs: readonly DialogInstance<T>[];
}) => {
  const isScrollLocked = dialogs.some(
    (dialog) => 'scrollLock' in dialog.state && dialog.state.scrollLock === true
  );

  useEffect(() => {
    if (isScrollLocked) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }

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
