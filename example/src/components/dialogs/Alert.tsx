import { useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';
import type { AlertDialogState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { useLayerBehavior } from 'react-layered-dialog';

type AlertProps = DialogState<AlertDialogState>;

export const Alert = ({
  id,
  title,
  message,
  onOk,
  zIndex,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  dimmed = true,
}: AlertProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onOk?.();
    closeDialog(id);
  }, [closeDialog, id, onOk]);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    closeOnEscape,
    onEscape: handleClose,
    closeOnOutsideClick,
    onOutsideClick: handleClose,
    outsideClickRef: panelRef,
  });

  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center ${
        dimmed ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ zIndex }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`alert-${id}-title`}
      aria-describedby={`alert-${id}-message`}
    >
      {dimmed && (
        <motion.div
          className="absolute inset-0 bg-black/40 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <motion.div
        ref={panelRef}
        className="relative min-w-[280px] rounded-lg bg-white p-6 shadow-xl pointer-events-auto"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
      >
        <h3 id={`alert-${id}-title`} className="text-lg font-semibold">
          {title}
        </h3>
        <p
          id={`alert-${id}-message`}
          className="mt-2 text-sm text-muted-foreground"
        >
          {message}
        </p>
        <div className="mt-4 flex justify-end">
          <Button autoFocus onClick={handleClose}>
            확인
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
