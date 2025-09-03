// factory.ts
import type React from 'react';
import { DialogManager } from './manager';
import { useSyncExternalStore } from 'react';
import type { BaseLayerProps, DialogState, DialogsConfig, DialogInstance } from './types';

/**
 * 다이얼로그 상태를 관리하는 `DialogManager`의 인스턴스를 생성합니다.
 * 이 함수는 라이브러리 설정의 가장 첫 단계에서 호출되어야 합니다.
 * @param config 라이브러리의 동작을 설정하는 객체입니다. (e.g., `baseZIndex`)
 * @returns `DialogManager` 인스턴스를 포함하는 객체입니다.
 */
export function createDialogManager<T extends { type: string }>(
  config?: DialogsConfig
) {
  const manager = new DialogManager<T>(config?.baseZIndex);
  return { manager };
}

type ComponentMap<T extends { type: string }> = {
  [K in T['type']]: React.ComponentType<DialogState<Extract<T, { type: K }>>>;
};

/**
 * 다이얼로그 상태를 React 컴포넌트와 연결하는 `useDialogs` 훅을 생성합니다.
 * @param manager `createDialogManager`를 통해 생성된 `DialogManager` 인스턴스입니다.
 * @param componentMap 다이얼로그의 `type` 문자열과 실제 렌더링될 React 컴포넌트를 매핑한 객체입니다.
 * @returns 앱 전체에서 사용할 수 있는 `useDialogs` 훅을 반환합니다.
 */
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
        Pick<BaseLayerProps, 'zIndex' | 'dimmed' | 'closeOnOverlayClick' | 'dismissable' | 'scrollLock'> & { id?: string }
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