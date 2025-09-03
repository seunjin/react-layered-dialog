import { useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { ModalState } from '@/lib/dialogs';
import {
  type DialogState,
  useLayerBehavior,
} from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type ModalProps = DialogState<ModalState>;

export const Modal = (props: ModalProps) => {
  const {
    id,
    children,
    zIndex,
    dimmed = true,
    closeOnOverlayClick = true,
    dismissable = true,
  } = props;

  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    closeDialog(id);
  };

  useLayerBehavior({
    zIndex,
    getTopZIndex: () => dialogs.at(-1)?.state?.zIndex,
    closeOnEscape: dismissable,
    onEscape: handleClose,
    autoFocus: true,
    focusRef: closeButtonRef,
    closeOnOutsideClick: closeOnOverlayClick,
    onOutsideClick: handleClose,
    outsideClickRef: panelRef,
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className={`absolute inset-0 ${dimmed ? 'bg-black/20' : 'bg-transparent'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      <motion.div
        ref={panelRef}
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[400px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div className="absolute top-2 right-2">
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};