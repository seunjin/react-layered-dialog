// factory.ts
import { useSyncExternalStore } from 'react';
import type React from 'react';
import { DialogManager } from './manager';
import type {
  DialogPatch,
  DialogState,
  DialogsConfig,
  DialogInstance,
  DialogHandle,
} from './types';

/**
 * 다이얼로그 상태를 관리하는 `DialogManager` 인스턴스를 생성합니다.
 * @param config `baseZIndex` 등 공통 설정 값
 * @returns `DialogManager` 인스턴스가 포함된 객체
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
 * @param manager `createDialogManager` 결과로 얻은 매니저 인스턴스
 * @param componentMap `type`과 실제 다이얼로그 컴포넌트를 매핑한 객체
 * @returns 다이얼로그 상태 배열과 제어 함수를 제공하는 커스텀 훅
 */
export function createUseDialogs<T extends { type: string }>(
  manager: DialogManager<T>,
  componentMap: ComponentMap<T>
) {
  type StateForType<K extends T['type']> = Extract<T, { type: K }>;
  type OpenDialogPayload<K extends T['type']> = Omit<StateForType<K>, 'type' | 'id' | 'isOpen'> & {
    id?: string;
  };
  type UpdateDialogPayload<K extends T['type']> =
    | DialogPatch<StateForType<K>>
    | ((prev: DialogState<StateForType<K>>) => DialogPatch<StateForType<K>> | null | undefined);

  /**
   * 라이브러리 사용자에게 공개되는 `useDialogs` 훅 구현입니다.
   */
  const useDialogs = () => {
    const dialogStates = useSyncExternalStore(
      manager.subscribe,
      manager.getSnapshot,
      manager.getServerSnapshot
    );

    const openDialog = <K extends T['type']>(type: K, payload: OpenDialogPayload<K>) => {
      const finalState = {
        type,
        ...payload,
      } as unknown as StateForType<K>;
      return manager.openDialog(finalState) as DialogHandle<K>;
    };

    const updateDialog = <K extends T['type']>(
      handle: DialogHandle<K>,
      nextState: UpdateDialogPayload<K>
    ) => {
      return manager.updateDialog(handle, nextState as Parameters<typeof manager.updateDialog>[1]);
    };

    // state 배열을 "상관된 유니온" 타입의 객체 배열로 변환합니다.
    const dialogs = dialogStates.map((state) => {
      const Component = componentMap[state.type as T['type']];
      if (!Component) {
        throw new Error(
          `[react-layered-dialog] "${state.type}" 타입에 대응하는 컴포넌트를 찾을 수 없습니다. componentMap 설정을 확인하세요.`
        );
      }
      return {
        Component,
        state,
      };
    }) as DialogInstance<T>[]; // 최종 타입을 단언합니다.

    return {
      dialogs,
      openDialog,
      closeDialog: manager.closeDialog,
      closeAllDialogs: manager.closeAllDialogs,
      updateDialog,
    };
  };

  return useDialogs;
}
