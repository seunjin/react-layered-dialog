import { close } from './lib/dialogs';
import type { AlertState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'framer-motion';

type AlertProps = DialogState<AlertState>;

export const Alert = ({ id, title, message, onOk, zIndex }: AlertProps) => {
  const handleOk = () => {
    onOk?.();
    close(id);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      {/* 오버레이: Fade-in/out 애니메이션 */}
      <motion.div
        className="absolute inset-0 bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />

      {/* 실제 컨텐츠: Scale-up/down 애니메이션 */}
      <motion.div
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleOk}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </motion.div>
    </div>
  );
};
