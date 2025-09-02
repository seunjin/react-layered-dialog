import type React from 'react';

export interface BaseState {
  zIndex?: number;
  dimmed?: boolean;
  closeOnOverlayClick?: boolean;
  dismissable?: boolean;
  scrollLock?: boolean;
}

export type DialogState<T> = T & {
  id: string;
  isOpen: boolean;
};

export type Listener = () => void;

/**
 * "상관된 유니온(Correlated Union)" 타입.
 * Component와 state 간의 타입 관계를 보장합니다.
 */
export type DialogInstance<T extends { type: string }> = {
  [K in T['type']]: {
    Component: React.ComponentType<DialogState<Extract<T, { type: K }>>>;
    state: DialogState<Extract<T, { type: K }>>;
  };
}[T['type']];

export interface DialogsConfig {
  baseZIndex?: number;
}
