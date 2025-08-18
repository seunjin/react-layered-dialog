import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { DialogManager } from './manager';

// --- Factory Function (Public API) ---

export function createDialogManager<T>() {
  const manager = new DialogManager<T>();

  /**
   * DialogManager의 상태를 구독하고 현재 열려있는 모든 다이얼로그 인스턴스를 반환하는 React Hook입니다.
   * 이 훅은 컴포넌트가 다이얼로그 목록의 변경 사항을 자동으로 감지하고 다시 렌더링하도록 합니다.
   *
   * @returns {DialogInstance<T>[]} 현재 열려있는 모든 다이얼로그 인스턴스의 배열
   */
  const useDialogsState = () => {
    return useSyncExternalStore(manager.subscribe, manager.getSnapshot);
  };

  return { manager, useDialogsState };
}
