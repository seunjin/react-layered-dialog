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

export type DialogBehaviorOptions = {
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type AlertDialogProps = {
  title: string;
  message: string;
  onOk?: () => void;
};

export type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  step?: 'confirm' | 'loading' | 'done';
};

export type ModalDialogProps = {
  title: string;
  description?: string;
  body: ReactNode;
  canDismiss?: boolean;
  onClose?: () => void;
};

export type PlainAlertDialogProps = {
  title: string;
  message: string;
  onOk?: () => void;
};

export type PlainConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type PlainModalDialogProps = {
  title: string;
  description?: string;
  body: ReactNode;
  canDismiss?: boolean;
  onClose?: () => void;
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
type DialogMethodParams<K extends AppDialogType> = Parameters<DialogMethod<K>>;
type DialogOptions<K extends AppDialogType> = DialogMethodParams<K> extends [unknown, infer O]
  ? O
  : undefined;
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

const BEHAVIOR_OPTION_KEYS: Array<keyof DialogBehaviorOptions> = [
  'dimmed',
  'closeOnEscape',
  'closeOnOutsideClick',
  'scrollLock',
];

const behaviorOptionKeySet = new Set<keyof DialogBehaviorOptions>(BEHAVIOR_OPTION_KEYS);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const extractBehaviorOptions = (input: Record<string, unknown>) => {
  const props: Record<string, unknown> = {};
  const options: DialogBehaviorOptions = {};

  for (const [key, value] of Object.entries(input)) {
    if (behaviorOptionKeySet.has(key as keyof DialogBehaviorOptions)) {
      options[key as keyof DialogBehaviorOptions] = value as never;
    } else {
      props[key] = value;
    }
  }

  return { props, options };
};

const mergeOptions = <K extends AppDialogType>(
  derived: Partial<DialogBehaviorOptions>,
  provided?: DialogOptions<K>
): DialogOptions<K> | undefined => {
  if (!provided && Object.keys(derived).length === 0) {
    return undefined;
  }

  if (!provided || typeof provided !== 'object' || provided === null) {
    return Object.keys(derived).length === 0 ? provided : (derived as DialogOptions<K>);
  }

  return {
    ...(derived as Record<string, unknown>),
    ...(provided as Record<string, unknown>),
  } as DialogOptions<K>;
};

const callOpen = <K extends AppDialogType>(
  type: K,
  input: DialogInput<K>,
  options?: DialogOptions<K>
): DialogResult<K> => {
  if (!isPlainObject(input)) {
    return dialogApi[type](input, options);
  }

  const { props, options: derivedOptions } = extractBehaviorOptions(input);
  const mergedOptions = mergeOptions<K>(derivedOptions, options);
  return dialogApi[type](props as DialogInput<K>, mergedOptions);
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

export function openDialog<K extends AppDialogType>(
  type: K,
  input: DialogInput<K>,
  options?: DialogOptions<K>
): DialogResult<K>;
export function openDialog<K extends AppDialogType>(
  payload: { type: K } & (DialogInput<K> extends Record<string, unknown> ? DialogInput<K> : never),
  options?: DialogOptions<K>
): DialogResult<K>;
export function openDialog(
  typeOrPayload: AppDialogType | { type: AppDialogType },
  inputOrOptions?: unknown,
  maybeOptions?: unknown
) {
  if (typeof typeOrPayload === 'string') {
    return callOpen(
      typeOrPayload,
      inputOrOptions as DialogInput<typeof typeOrPayload>,
      maybeOptions as DialogOptions<typeof typeOrPayload>
    );
  }

  const { type, ...rest } = typeOrPayload;
  return callOpen(
    type,
    rest as DialogInput<typeof type>,
    inputOrOptions as DialogOptions<typeof type>
  );
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
