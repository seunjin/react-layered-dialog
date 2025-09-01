import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type React from 'react';

// =================================================================
// 1. 다이얼로그 타입 정의 (Type Definition)
// =================================================================
// 사용할 모든 다이얼로그의 `props` 타입을 정의합니다.
// `BaseState`를 확장하여 `type` 속성을 필수로 포함해야 합니다.

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

// =================================================================
// 2. 상태 유니온 (State Union)
// =================================================================
// 정의된 모든 다이얼로그 상태 타입을 하나의 유니온 타입으로 결합합니다.
// 이 타입은 `createDialogManager`의 제네릭으로 사용되어 타입 안정성을 보장합니다.

export type CustomDialogState = AlertState | ConfirmState | ModalState;

// =================================================================
// 3. 매니저 생성 (Manager Creation)
// =================================================================
// `createDialogManager`를 호출하여 다이얼로그 상태를 관리할 매니저를 생성합니다.
// 제네릭으로 위에서 정의한 유니온 타입을 전달합니다.
// 필요 시 `baseZIndex`와 같은 옵션을 설정할 수 있습니다.

const { manager } = createDialogManager<CustomDialogState>({
  // baseZIndex: 2000, // z-index 시작 값 변경이 필요할 경우 주석 해제
});

// =================================================================
// 4. 컴포넌트 맵핑 (Component Mapping)
// =================================================================
// 1단계에서 정의한 `type` 문자열과, 해당 다이얼로그를 렌더링할 React 컴포넌트를
// 1:1로 매핑하는 객체를 생성합니다.

const componentMap = {
  alert: Alert,
  confirm: Confirm,
  modal: Modal,
};

// =================================================================
// 5. 훅 생성 및 내보내기 (Hook Creation & Export)
// =================================================================
// `createUseDialogs` 팩토리 함수에 `manager`와 `componentMap`을 전달하여
// 앱 전체에서 사용할 `useDialogs` 훅을 생성합니다.

export const useDialogs = createUseDialogs(manager, componentMap);

// 편의를 위해 `close` 함수들을 직접 내보내, 어느 컴포넌트에서든 쉽게 호출할 수 있도록 합니다.
export const closeDialog = manager.closeDialog;
export const closeAllDialogs = manager.closeAllDialogs;