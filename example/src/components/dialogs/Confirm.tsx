import { useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { ConfirmState } from '@/lib/dialogs';
import {
  type DialogState,
  useLayerBehavior,
} from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

type ConfirmProps = DialogState<ConfirmState>;

export const Confirm = (props: ConfirmProps) => {
  const {
    id,
    title,
    message,
    onConfirm,
    onCancel,
    zIndex,
    dimmed = true,
    closeOnOverlayClick = true,
    dismissable = true,
  } = props;

  const { dialogs, closeDialog } = useDialogs();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleCancel = () => {
    onCancel?.();
    closeDialog(id);
  };

  const handleConfirm = () => {
    onConfirm?.();
    closeDialog(id);
  };

  useLayerBehavior({
    zIndex,
    getTopZIndex: () => dialogs.at(-1)?.state?.zIndex,
    closeOnEscape: dismissable,
    onEscape: handleCancel,
    autoFocus: true,
    focusRef: confirmButtonRef,
    closeOnOutsideClick: closeOnOverlayClick,
    onOutsideClick: handleCancel,
    outsideClickRef: rootRef,
  });

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <motion.div
        className={`absolute inset-0 ${dimmed ? 'bg-black/20' : 'bg-transparent'}`}
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
        <h3 id="confirm-title" className="text-lg font-bold">
          {title}
        </h3>
        <p id="confirm-message" className="mt-2 text-sm text-gray-500">
          {message}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button ref={confirmButtonRef} onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
