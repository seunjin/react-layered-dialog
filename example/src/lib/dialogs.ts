import { useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import {
  DialogStore,
  createDialogApi,
  type DialogOpenResult,
  type DialogStateUpdater,
  type DialogStoreSnapshot,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import { PlainAlert } from '@/components/dialogs/plain/PlainAlert';
import { PlainConfirm } from '@/components/dialogs/plain/PlainConfirm';
import { PlainModal } from '@/components/dialogs/plain/PlainModal';

export type AlertDialogProps = {
  title: string;
  message: string;
  onOk?: () => void;
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  step?: 'confirm' | 'loading' | 'done';
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type ModalDialogProps = {
  title: string;
  description?: string;
  body: ReactNode;
  canDismiss?: boolean;
  onClose?: () => void;
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type PlainAlertDialogProps = {
  title: string;
  message: string;
  onOk?: () => void;
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type PlainConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type PlainModalDialogProps = {
  title: string;
  description?: string;
  body: ReactNode;
  canDismiss?: boolean;
  onClose?: () => void;
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

/** 애플리케이션 다이얼로그 스토어 인스턴스 */
export const appDialogStore = new DialogStore();

/**
 * 기본 다이얼로그 컴포넌트를 레지스트리에 등록합니다.
 * createDialogApi가 레지스트리를 바탕으로 고수준 메서드를 생성합니다.
 */
const registry = {
  alert: { component: Alert },
  confirm: { component: Confirm },
  modal: { component: Modal },
  'plain-alert': { component: PlainAlert },
  'plain-confirm': { component: PlainConfirm },
  'plain-modal': { component: PlainModal },
} as const;

const dialogApi = createDialogApi(appDialogStore, registry);

export type AppDialogApi = typeof dialogApi;
export type AppDialogRegistry = typeof registry;
export type AppDialogType = keyof AppDialogRegistry;

type DialogMethod<K extends AppDialogType> = typeof dialogApi[K];
type DialogInput<K extends AppDialogType> = Parameters<DialogMethod<K>>[0];
type DialogResult<K extends AppDialogType> = ReturnType<DialogMethod<K>>;
type DialogResultUnion = {
  [K in AppDialogType]: DialogResult<K>;
}[AppDialogType];

type DialogIdentifier =
  | string
  | { id: string }
  | { dialog: { id: string } }
  | DialogOpenResult
  | DialogResultUnion;

const callOpen = <K extends AppDialogType>(type: K, input: DialogInput<K>): DialogResult<K> => {
  return dialogApi[type](input);
};

const resolveDialogId = (target?: DialogIdentifier | null) => {
  if (!target) return null;
  if (typeof target === 'string') return target;
  if ('dialog' in target && target.dialog) {
    return target.dialog.id;
  }
  if ('id' in target && typeof target.id === 'string') {
    return target.id;
  }
  return null;
};

export function openDialog<K extends AppDialogType>(type: K, input: DialogInput<K>): DialogResult<K>;
export function openDialog<K extends AppDialogType>(
  payload: { type: K } & (DialogInput<K> extends Record<string, unknown> ? DialogInput<K> : never)
): DialogResult<K>;
export function openDialog(typeOrPayload: AppDialogType | { type: AppDialogType }, input?: unknown) {
  if (typeof typeOrPayload === 'string') {
    return callOpen(typeOrPayload, input as DialogInput<typeof typeOrPayload>);
  }

  const { type, ...rest } = typeOrPayload;
  return callOpen(type, rest as DialogInput<typeof type>);
}

export const closeAllDialogs = () => {
  dialogApi.closeAll();
};

export const unmountAllDialogs = () => {
  dialogApi.unmountAll();
};

export function closeDialog(target?: DialogIdentifier | null) {
  if (typeof target === 'undefined' || target === null) {
    dialogApi.close();
    return;
  }

  const id = resolveDialogId(target);
  if (!id) {
    dialogApi.close();
    return;
  }

  dialogApi.close(id);
}

export function unmountDialog(target?: DialogIdentifier | null) {
  if (typeof target === 'undefined' || target === null) {
    dialogApi.unmount();
    return;
  }

  const id = resolveDialogId(target);
  if (!id) {
    dialogApi.unmount();
    return;
  }

  dialogApi.unmount(id);
}

export function updateDialog<TProps extends Record<string, unknown>>(
  target: DialogIdentifier,
  updater: DialogStateUpdater<TProps>
) {
  const id = resolveDialogId(target);
  if (!id) return;
  dialogApi.update(id, updater);
}

/**
 * 다이얼로그 스토어와 제어 함수를 한 번에 제공하는 훅입니다.
 * 렌더러 전환 단계에서는 스냅샷을 그대로 노출해 기존 구조와 병행해 사용할 수 있습니다.
 */
export function useDialogs() {
  const snapshot = useSyncExternalStore<DialogStoreSnapshot>(
    appDialogStore.subscribe,
    appDialogStore.getSnapshot,
    appDialogStore.getSnapshot
  );

  return useMemo(
    () => ({
      store: appDialogStore,
      dialogs: snapshot.entries,
      openDialog,
      closeDialog,
      closeAllDialogs,
      unmountDialog,
      unmountAllDialogs,
      updateDialog,
    }),
    [snapshot]
  );
}
