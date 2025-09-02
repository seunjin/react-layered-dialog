import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type React from 'react';

// 1. 다이얼로그 타입 정의
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

// 2. 상태 유니온
export type CustomDialogState = AlertState | ConfirmState | ModalState;

// 3. 매니저 생성
const { manager } = createDialogManager<CustomDialogState>();

// 4. 컴포넌트 맵핑
const componentMap = {
  alert: Alert,
  confirm: Confirm,
  modal: Modal,
};

// 5. 훅 생성
export const useDialogs = createUseDialogs(manager, componentMap);

// 편의를 위해 `close` 함수들을 직접 내보냅니다.
export const closeDialog = manager.closeDialog;
export const closeAllDialogs = manager.closeAllDialogs;
