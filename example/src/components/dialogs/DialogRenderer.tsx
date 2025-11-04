import { useEffect, useSyncExternalStore } from 'react';
import { DialogsRenderer, type DialogStore } from 'react-layered-dialog';
import type { DialogBehaviorOptions } from '@/lib/dialogs';

export const DialogRenderer = ({ store }: { store: DialogStore }) => {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  const isScrollLocked = snapshot.entries.some((entry) => {
    const options = entry.options as DialogBehaviorOptions & { zIndex: number };
    if (options.scrollLock === true) return true;
    const state = entry.state as Record<string, unknown> | undefined;
    return state?.scrollLock === true;
  });

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

  return <DialogsRenderer store={store} />;
};
