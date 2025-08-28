// factory.ts
import type React from 'react';
import { DialogManager } from './manager';
import { useSyncExternalStore } from 'react';
import type { BaseState, DialogsConfig, DialogState, SomeDialogInstance } from './types';

export function createDialogManager<T extends { type: string }>(
  config?: DialogsConfig
) {
  const manager = new DialogManager<T>(config?.baseZIndex);

  const useDialogsState = (): SomeDialogInstance<T>[] => {
    return useSyncExternalStore(manager.subscribe, manager.getSnapshot);
  };

  return { manager, useDialogsState };
}

/**
 * 다이얼로그 컴포넌트들을 'type' 문자열을 키로 하여 매핑한 객체 타입
 */
type ComponentMap<T extends { type: string }> = {
  [K in T['type']]: React.ComponentType<DialogState<Extract<T, { type: K }>>>;
};

/**
 * 타입이 완벽하게 설정된 useDialogs 훅을 생성하는 팩토리 함수.
 * @param manager createDialogManager에서 생성된 manager 인스턴스
 * @param componentMap 다이얼로그 'type'과 컴포넌트를 매핑한 객체
 */
export function createUseDialogs<T extends { type: string }>(
  manager: DialogManager<T>,
  componentMap: ComponentMap<T>
) {
  // `type`을 기반으로 해당하는 상태 타입을 추론하는 헬퍼
  type StateForType<K extends T['type']> = Extract<T, { type: K }>;

  const useDialogs = () => {
    const dialogs = useSyncExternalStore(manager.subscribe, manager.getSnapshot);

    const openDialog = <K extends T['type']>(
      type: K,
      // Omit<...>으로 순수 사용자 상태를 가져온 뒤, BaseState의 일부 속성을 결합합니다.
      payload: Omit<StateForType<K>, 'type' | 'isOpen'> &
        Pick<BaseState, 'zIndex' | 'dimmed' | 'closeOnOverlayClick' | 'dismissable' | 'scrollLock'> & { id?: string }
    ) => {
      const { id, ...userState } = payload;

      const component = componentMap[type];
      if (!component) {
        throw new Error(`[react-layered-dialog] Component for type "${type}" not found.`);
      }

      const finalState = {
        type,
        id,
        ...userState,
      } as unknown as StateForType<K>;

      return manager.openDialog(component, finalState);
    };

    return {
      dialogs,
      openDialog,
      closeDialog: manager.closeDialog,
      closeAllDialogs: manager.closeAllDialogs,
    };
  };

  return useDialogs;
}
