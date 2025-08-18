import type React from 'react';
import type {
  BaseDialogState,
  DialogInstance,
  DialogState,
  Listener,
  ManagerConfig,
} from './types';

// --- DialogManager Class (Internal Implementation) ---

export class DialogManager<T extends BaseDialogState> {
  private dialogs: DialogInstance<T>[] = [];
  private listeners: Set<Listener> = new Set();
  private config: ManagerConfig<T>;

  constructor(config: ManagerConfig<T> = {}) {
    this.config = config;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): DialogInstance<T>[] => {
    return this.dialogs;
  };

  private emitChange = () => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  open = (
    Component: React.ComponentType<DialogState<T>>,
    state: T, // State is now the user-defined type T
  ): string => {
    const id = `dialog-${Date.now()}-${Math.random()}`;
    const defaults = (state.type && this.config.defaults?.[state.type]) || {};

    const finalState: DialogState<T> = {
      ...defaults,
      ...state,
      id,
      isOpen: true,
    };

    const newDialog: DialogInstance<T> = {
      Component,
      state: finalState,
    };

    this.dialogs = [...this.dialogs, newDialog];
    this.emitChange();
    return id;
  };

  close = (id: string) => {
    this.dialogs = this.dialogs.filter((dialog) => dialog.state.id !== id);
    this.emitChange();
  };

  closeAll = () => {
    this.dialogs = [];
    this.emitChange();
  };
}