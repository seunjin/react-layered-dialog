export { createDialogManager, createUseDialogs } from './core/factory';
export type {
  BaseLayerProps,
  BaseState,
  BaseStateMeta,
  DialogState,
  DialogInstance,
  DialogsConfig,
  DialogHandle,
} from './core/types';
export { useLayerBehavior } from './hooks/useLayerBehavior';
export type { UseLayerBehaviorOptions } from './hooks/useLayerBehavior';

// renewal export
export { DialogStore } from './renewal/dialog-store';
export { DialogsRenderer, useDialogController } from './renewal/dialogs-renderer';
export type {
  DialogControllerContextValue,
  DialogEntry,
  DialogId,
  DialogListener,
  DialogRenderFn,
  DialogStackInfo,
  DialogStoreSnapshot,
  OpenDialogOptions,
  OpenDialogResult,
} from './renewal/types';
