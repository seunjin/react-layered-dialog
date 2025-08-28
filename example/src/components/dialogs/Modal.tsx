import { useEffect } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { ModalState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type ModalProps = DialogState<ModalState>;

export const Modal = ({
  children,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = true,
  dismissable = true,
}: ModalProps) => {
  const { dialogs, closeDialog } = useDialogs();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopDialog =
        dialogs.length > 0 &&
        dialogs[dialogs.length - 1].state.zIndex === zIndex;
      if (event.key === 'Escape' && dismissable && isTopDialog) {
        closeDialog();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissable, closeDialog, dialogs, zIndex]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      closeDialog();
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
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[400px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" onClick={() => closeDialog()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};
