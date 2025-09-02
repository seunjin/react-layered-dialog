// factory.ts
import type React from 'react';
import { DialogManager } from './manager';
import { useSyncExternalStore } from 'react';
import type { BaseState, DialogState, DialogsConfig, DialogInstance } from './types';

export function createDialogManager<T extends { type: string }>(
  config?: DialogsConfig
) {
  const manager = new DialogManager<T>(config?.baseZIndex);
  return { manager };
}

type ComponentMap<T extends { type: string }> = {
  [K in T['type']]: React.ComponentType<DialogState<Extract<T, { type: K }>>>;
};

export function createUseDialogs<T extends { type: string }>(
  manager: DialogManager<T>,
  componentMap: ComponentMap<T>
) {
  type StateForType<K extends T['type']> = Extract<T, { type: K }>;

  const useDialogs = () => {
    const dialogStates = useSyncExternalStore(manager.subscribe, manager.getSnapshot);

    const openDialog = <K extends T['type']>(
      type: K,
      payload: Omit<StateForType<K>, 'type' | 'isOpen'> &
        Pick<BaseState, 'zIndex' | 'dimmed' | 'closeOnOverlayClick' | 'dismissable' | 'scrollLock'> & { id?: string }
    ) => {
      const finalState = {
        type,
        ...payload,
      } as unknown as StateForType<K>;
      return manager.openDialog(finalState);
    };

    // state 배열을 "상관된 유니온" 타입의 객체 배열로 변환합니다.
    const dialogs = dialogStates.map((state) => {
      return {
        Component: componentMap[state.type as T['type']],
        state,
      };
    }) as DialogInstance<T>[]; // 최종 타입을 단언합니다.

    return {
      dialogs,
      openDialog,
      closeDialog: manager.closeDialog,
      closeAllDialogs: manager.closeAllDialogs,
    };
  };

  return useDialogs;
}