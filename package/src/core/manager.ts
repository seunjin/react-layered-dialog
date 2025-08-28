// manager.ts
import type React from 'react';
import type {
  DialogInstance,
  DialogState,
  Listener,
  SomeDialogInstance,
} from './types';

export class DialogManager<T extends { type: string }> {
  private dialogs: SomeDialogInstance<T>[] = [];
  private listeners: Set<Listener> = new Set();
  private baseZIndex: number;

  constructor(baseZIndex: number = 1000) {
    this.baseZIndex = baseZIndex;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): SomeDialogInstance<T>[] => {
    return this.dialogs;
  };

  private emitChange = () => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  openDialog = <P extends T & { id?: string; zIndex?: number }>(
    Component: React.ComponentType<DialogState<P>>,
    state: P
  ): string => {
    const finalId = state.id ?? crypto.randomUUID();

    if (state.id && this.dialogs.some((d) => d.state.id === state.id)) {
      console.warn(
        `[react-layered-dialog] Duplicate ID detected: "${state.id}". This may lead to unexpected behavior.`
      );
    }

    const finalState: DialogState<P> = {
      ...state,
      id: finalId,
      isOpen: true,
      // zIndex를 사용자가 제공하지 않았다면, 자동으로 계산하여 주입합니다.
      zIndex: state.zIndex ?? this.baseZIndex + this.dialogs.length,
    };

    const newDialog: DialogInstance<P> = {
      Component,
      state: finalState,
    };

    this.dialogs = [
      ...this.dialogs,
      newDialog as unknown as SomeDialogInstance<T>,
    ];
    this.emitChange();
    return finalId;
  };

  closeDialog = (id?: string): void => {
    if (id) {
      // ID가 있으면 특정 다이얼로그를 제거합니다.
      this.dialogs = this.dialogs.filter((dialog) => dialog.state.id !== id);
    } else if (this.dialogs.length > 0) {
      // ID가 없으면 마지막 다이얼로그를 제거합니다. (pop 동작)
      this.dialogs = this.dialogs.slice(0, -1);
    }
    this.emitChange();
  };

  closeAllDialogs = () => {
    this.dialogs = [];
    this.emitChange();
  };
}


