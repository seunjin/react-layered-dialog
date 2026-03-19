export { DialogStore } from './store';
export type { DialogStoreOptions } from './store';
export { DialogsRenderer, useDialogController, useDialogStore } from './renderer';
export {
  createDialogApi,
  defineDialog,
  type DialogComponent,
  type DialogDefinition,
  type DialogInput,
  type DialogMode,
  type DefineDialogOptions,
} from './registry';
export type {
  // 새 이름
  DialogRef,
  DialogHandle,
  SyncDialogController,
  AsyncDialogController,
  // 기존 타입
  DialogAsyncResolvePayload,
  DialogAsyncResult,
  DialogControllerContextValue,
  DialogEntry,
  DialogEntryMeta,
  DialogId,
  DialogListener,
  DialogRenderFn,
  DialogStackInfo,
  DialogStateUpdater,
  DialogStatus,
  DialogStoreSnapshot,
  OpenDialogOptions,
  // deprecated aliases
  OpenDialogResult,
  DialogOpenResult,
} from './types';
