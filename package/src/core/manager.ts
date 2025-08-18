// manager.ts
import type React from 'react';
import type { DialogInstance, DialogState, Listener } from './types';

export class DialogManager<T> {
  private dialogs: DialogInstance<T>[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {}

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
    state: T // 사용자가 정의한 상태 T를 직접 받습니다.
  ): string => {
    const id = `dialog-${Date.now()}-${Math.random()}`;

    const finalState: DialogState<T> = {
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
