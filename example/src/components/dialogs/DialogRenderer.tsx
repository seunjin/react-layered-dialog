import { AnimatePresence } from 'motion/react';
import type { SomeDialogInstance } from 'react-layered-dialog';
import type { CustomDialogState } from '@/lib/dialogs';
import { useDialogs } from '@/lib/dialogs';

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

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <AnimatePresence>
      {dialogs.map((dialog) => (
        <DialogComponent key={dialog.state.id} dialog={dialog} />
      ))}
    </AnimatePresence>
  );
};
