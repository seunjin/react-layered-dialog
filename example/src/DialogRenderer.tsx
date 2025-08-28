import type { SomeDialogInstance } from 'react-layered-dialog';
import type { CustomDialogState } from './lib/dialogs';

// 1. 렌더링할 실제 컴포넌트들을 직접 import 합니다.
import { Alert } from './Alert';
import { Confirm } from './Confirm';
import { Modal } from './Modal';

interface DialogRendererProps {
  dialog: SomeDialogInstance<CustomDialogState>;
}

export const DialogRenderer = ({ dialog }: DialogRendererProps) => {
  // 2. state.type에 따라 실제 컴포넌트를 명시적으로 렌더링합니다.
  switch (dialog.state.type) {
    case 'alert':
      // 이 블록 안에서 dialog.state는 AlertState 타입으로 완벽하게 추론되며,
      // Alert 컴포넌트는 AlertState 타입의 props를 받으므로 타입이 일치합니다.
      return <Alert {...dialog.state} />;
    case 'confirm':
      return <Confirm {...dialog.state} />;
    case 'modal':
      return <Modal {...dialog.state} />;
    default:
      return null;
  }
};
