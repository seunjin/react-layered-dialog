import { useEffect, useCallback } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { ConfirmState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

type ConfirmProps = DialogState<ConfirmState>;

export const Confirm = ({
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = false,
  dismissable = false,
}: ConfirmProps) => {
  const { dialogs, closeDialog } = useDialogs();

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      closeDialog();
    }
  }, [onCancel, closeDialog]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopDialog = dialogs.length > 0 && dialogs[dialogs.length - 1].state.zIndex === zIndex;
      if (event.key === 'Escape' && dismissable && isTopDialog) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissable, handleCancel, dialogs, zIndex]);

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      handleCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      <motion.div
        className={`absolute inset-0 ${dimmed ? 'bg-black/20' : 'bg-transparent'}`}
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </div>
      </motion.div>
    </div>
  );
};
