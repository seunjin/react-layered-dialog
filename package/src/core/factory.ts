import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { DialogManager } from './manager';
import type { BaseDialogState, DialogInstance, ManagerConfig } from './types';

// --- Factory Function (Public API) ---

export function createDialogManager<T extends BaseDialogState>(
  config?: ManagerConfig<T>
) {
  const manager = new DialogManager<T>(config);

  const useDialogs: () => DialogInstance<T>[] = () => {
    return useSyncExternalStore(manager.subscribe, manager.getSnapshot);
  };

  return { manager, useDialogs };
}
