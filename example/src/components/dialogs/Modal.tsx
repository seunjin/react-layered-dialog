import { useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';
import type { ModalDialogState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { useLayerBehavior } from 'react-layered-dialog';

type ModalProps = DialogState<ModalDialogState>;

export const Modal = ({
  id,
  title,
  description,
  body,
  footer,
  canDismiss = true,
  zIndex,
}: ModalProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    closeDialog(id);
  }, [closeDialog, id]);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    autoFocus: canDismiss,
    focusRef: canDismiss ? closeButtonRef : undefined,
    closeOnEscape: canDismiss,
    onEscape: handleClose,
    closeOnOutsideClick: canDismiss,
    onOutsideClick: handleClose,
    outsideClickRef: panelRef,
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-${id}-title`}
      aria-describedby={description ? `modal-${id}-description` : undefined}
    >
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`modal-${id}-title`} className="text-xl font-semibold">
              {title}
            </h2>
            {description ? (
              <p
                id={`modal-${id}-description`}
                className="mt-1 text-sm text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          {canDismiss ? (
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </header>
        <div className="mt-4 space-y-4">{body}</div>
        {footer ? <footer className="mt-6">{footer}</footer> : null}
      </motion.div>
    </div>
  );
};
