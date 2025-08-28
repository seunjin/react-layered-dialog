import { AnimatePresence } from 'framer-motion';
import type { SomeDialogInstance } from 'react-layered-dialog';
import type { CustomDialogState } from './lib/dialogs';
import { useDialogs } from './lib/dialogs';

import { Alert } from './Alert';
import { Confirm } from './Confirm';
import { Modal } from './Modal';

interface DialogComponentProps {
  dialog: SomeDialogInstance<CustomDialogState>;
}

const DialogComponent = ({ dialog }: DialogComponentProps) => {
  switch (dialog.state.type) {
    case 'alert':
      return <Alert {...dialog.state} />;
    case 'confirm':
      return <Confirm {...dialog.state} />;
    case 'modal':
      return <Modal {...dialog.state} />;
    default:
      return null;
  }
};

/**
 * 이 컴포넌트는 다이얼로그의 렌더링과 애니메이션 '존재' 여부만 관리합니다.
 * 실제 애니메이션 로직은 각 개별 다이얼로그 컴포넌트가 담당합니다.
 */
export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <AnimatePresence>
      {dialogs.map((dialog) => (
        // key는 AnimatePresence가 각 컴포넌트를 추적하기 위해 필수적입니다.
        <DialogComponent key={dialog.state.id} dialog={dialog} />
      ))}
    </AnimatePresence>
  );
};
