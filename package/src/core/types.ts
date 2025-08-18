import type React from 'react';

// --- Core Types ---

/**
 * The base interface for user-defined dialog state.
 * This should contain only the data specific to the dialog's content and behavior.
 */
export interface BaseDialogState {
  type?: string; // Optional 'type' for defaults
}

/**
 * The internal, complete state of a dialog instance, including managed properties.
 * @template T The user-defined state, extending BaseDialogState.
 */
export type DialogState<T extends BaseDialogState> = T & {
  id: string;
  isOpen: boolean;
};

/**
 * The internal representation of a dialog instance in the manager's state.
 * It holds the component and the full internal state object.
 * @template T The user-defined state, extending BaseDialogState.
 */
export interface DialogInstance<T extends BaseDialogState> {
  Component: React.ComponentType<DialogState<T>>; // Component receives the full internal state
  state: DialogState<T>; // The full internal state object
}

export type Listener = () => void;

/**
 * Configuration for the DialogManager.
 * @template T The user-defined state, extending BaseDialogState.
 */
export interface ManagerConfig<T extends BaseDialogState> {
  defaults?: Record<string, Partial<T>>; // Defaults apply to the user-defined state
}
