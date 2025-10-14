import { createDialogManager, createUseDialogs } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type { ReactNode } from 'react';

type AppDialogState =
  | {
      type: 'alert';
      title: string;
      message: string;
      onOk?: () => void;
    }
  | {
      type: 'confirm';
      title: string;
      message: string;
      onConfirm?: () => void;
      onCancel?: () => void;
    }
  | {
      type: 'modal';
      title: string;
      description?: string;
      body: ReactNode;
      footer?: ReactNode;
      canDismiss?: boolean;
    };

export type AlertDialogState = Extract<AppDialogState, { type: 'alert' }>;
export type ConfirmDialogState = Extract<AppDialogState, { type: 'confirm' }>;
export type ModalDialogState = Extract<AppDialogState, { type: 'modal' }>;

const { manager } = createDialogManager<AppDialogState>();

export const useDialogs = createUseDialogs(manager, {
  alert: Alert,
  confirm: Confirm,
  modal: Modal,
});

export const openDialog = manager.openDialog;
export const closeDialog = manager.closeDialog;
export const closeAllDialogs = manager.closeAllDialogs;
export const updateDialog = manager.updateDialog;
