import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type React from 'react';

// --- Core Types ---

/**
 * The base interface that all user-defined dialog state types must extend.
 * It now includes 'id' and 'isOpen' as fundamental properties of the dialog's state.
 */
export interface BaseDialogState {
  id: string; // Re-added
  isOpen: boolean; // Re-added
  type?: string; // Optional 'type' for defaults
}

/**
 * The internal representation of a dialog instance in the manager's state.
 * It holds the component and the full state object (which includes id and isOpen).
 */
export interface DialogInstance<T extends BaseDialogState> {
  Component: React.ComponentType<T>; // Component receives the full state T as props
  state: T; // The full state object, including id and isOpen
}

type Listener = () => void;

export interface ManagerConfig<T extends BaseDialogState> {
  defaults?: Record<string, Partial<Omit<T, 'id' | 'isOpen'>>>;
}

// --- DialogManager Class (Internal Implementation) ---

class DialogManager<T extends BaseDialogState> {
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

  open = (Component: React.ComponentType<T>, state: Omit<T, 'id' | 'isOpen'>): string => {
    const id = `dialog-${Date.now()}-${Math.random()}`;
    const defaults = (state.type && this.config.defaults?.[state.type]) || {};

    const finalState = {
      ...defaults,
      ...state,
      id,
      isOpen: true,
    } as T;

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

// --- Factory Function (Public API) ---

export function createDialogManager<T extends BaseDialogState>(config?: ManagerConfig<T>) {
  const manager = new DialogManager<T>(config);

  const useDialogs: () => DialogInstance<T>[] = () => {
    return useSyncExternalStore(manager.subscribe, manager.getSnapshot);
  };

  return { manager, useDialogs };
}
