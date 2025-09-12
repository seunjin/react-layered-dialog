import {
  createDialogManager,
  createUseDialogs,
  type BaseLayerProps,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type React from 'react';

// 1. 다이얼로그별 상태(State) 타입을 정의합니다.
export interface AlertState extends BaseLayerProps {
  type: 'alert';
  title: string;
  message: string;
  onOk?: () => void;
}
export interface ConfirmState extends BaseLayerProps {
  type: 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
export interface ModalState extends BaseLayerProps {
  type: 'modal';
  children: React.ReactNode;
}

// 2. 모든 다이얼로그 상태를 포함하는 유니온 타입을 만듭니다.
export type CustomDialogState = AlertState | ConfirmState | ModalState;

// 3. 다이얼로그 시스템의 핵심인 manager와 컴포넌트 맵을 생성합니다.
const { manager } = createDialogManager<CustomDialogState>();
const componentMap = { alert: Alert, confirm: Confirm, modal: Modal };

// 4. 앱 전체에서 사용할 훅과 함수들을 생성하고 내보냅니다.

/**
 * React 컴포넌트 내에서 다이얼로그를 제어할 때 사용하는 기본 훅입니다. (권장)
 * 타입 추론이 강력하고 사용이 간편합니다.
 * @example
 * const { openDialog } = useDialogs();
 * openDialog('alert', { title: '알림', message: '안녕하세요!' });
 */
export const useDialogs = createUseDialogs(manager, componentMap);

/**
 * React 컴포넌트 외부(예: API 유틸리티, 상태 관리 로직)에서 다이얼로그를 열 때 사용하는 저수준 함수입니다.
 * state 객체에 `type`을 명시해야 합니다.
 * @example
 * openDialog({ type: 'alert', title: '오류', message: '서버 통신 실패' });
 */
export const openDialog = manager.openDialog;

/**
 * 다이얼로그를 닫습니다. 컴포넌트 내부/외부 어디서든 사용할 수 있습니다.
 * @param id - 특정 다이얼로그를 닫고 싶을 때 전달하는 ID. 없으면 가장 위의 다이얼로그를 닫습니다.
 */
export const closeDialog = manager.closeDialog;

/**
 * 모든 다이얼로그를 한 번에 닫습니다.
 */
export const closeAllDialogs = manager.closeAllDialogs;
