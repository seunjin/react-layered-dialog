import { close } from './lib/dialogs';
import type { ConfirmState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'framer-motion';

type ConfirmProps = DialogState<ConfirmState>;

export const Confirm = ({
  id,
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
}: ConfirmProps) => {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      close(id);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="absolute inset-0 bg-black/20"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]"
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
