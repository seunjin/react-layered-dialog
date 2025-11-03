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
export {
  createDialogApi,
  defineDialog,
  type DialogMode,
  type DialogComponent,
  type DialogInput,
  type DialogDefinition,
  type DefineDialogOptions,
} from './renewal/dialog-registry';
export type {
  DialogControllerContextValue,
  DialogEntry,
  DialogEntryMeta,
  DialogId,
  DialogListener,
  DialogRenderFn,
  DialogStatus,
  DialogStackInfo,
  DialogStateUpdater,
  DialogOpenResult,
  DialogAsyncResult,
  DialogAsyncResolvePayload,
  DialogStoreSnapshot,
  OpenDialogOptions,
  OpenDialogResult,
} from './renewal/types';
