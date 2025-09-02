import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type React from 'react';

// 타입 정의
export interface AlertState extends BaseState {
  type: 'alert';
  title: string;
  message: string;
  onOk?: () => void;
}
export interface ConfirmState extends BaseState {
  type: 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
export interface ModalState extends BaseState {
  type: 'modal';
  children: React.ReactNode;
}
export type CustomDialogState = AlertState | ConfirmState | ModalState;

// 시스템 생성
const { manager } = createDialogManager<CustomDialogState>();
const componentMap = { alert: Alert, confirm: Confirm, modal: Modal };
export const useDialogs = createUseDialogs(manager, componentMap);

// 편의 export
export const closeDialog = manager.closeDialog;
export const closeAllDialogs = manager.closeAllDialogs;
