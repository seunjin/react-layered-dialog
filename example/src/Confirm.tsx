import { closeDialog } from './lib/dialogs';
import type { ConfirmState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'motion/react';

type ConfirmProps = DialogState<ConfirmState>;

export const Confirm = ({
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = true,
}: ConfirmProps) => {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeDialog();
    }
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
      {/* 오버레이: dimmed prop에 따라 배경색이 결정됩니다. */}
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
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            확인
          </button>
        </div>
      </motion.div>
    </div>
  );
};
