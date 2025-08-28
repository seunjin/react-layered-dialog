import { close } from './lib/dialogs';
import type { ModalState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'framer-motion';

type ModalProps = DialogState<ModalState>;

export const Modal = ({ id, children, zIndex }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      <motion.div
        className="absolute inset-0 bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[400px]"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div className="absolute top-2 right-2">
          <button
            onClick={() => close(id)}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};
