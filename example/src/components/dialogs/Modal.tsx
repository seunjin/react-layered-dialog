import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  useDialogController,
  type DialogComponent,
} from 'react-layered-dialog';
import type { DialogBehaviorOptions, ModalDialogProps } from '@/lib/dialogs';

export const Modal = ((props: ModalDialogProps) => {
  const controller = useDialogController<
    ModalDialogProps,
    DialogBehaviorOptions
  >();
  const { id, isOpen, options, close, unmount, getStateFields, stack } =
    controller;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { title, description, body, canDismiss, onClose } = getStateFields({
    title: props.title,
    description: props.description,
    body: props.body,
    canDismiss: props.canDismiss ?? false,
    onClose: props.onClose,
  });

  const closeOnEscapeFlag = options.closeOnEscape ?? canDismiss ?? false;
  const closeOnOutsideClickFlag =
    options.closeOnOutsideClick ?? closeOnEscapeFlag;
  const dimmed = options.dimmed ?? true;
  const zIndex = options.zIndex;
  const isTop = stack.index === stack.size - 1;

  const handleClose = useCallback(() => {
    onClose?.();
    close();
  }, [close, onClose]);

  useEffect(() => {
    if (canDismiss) {
      closeButtonRef.current?.focus();
    }
  }, [canDismiss]);

  useEffect(() => {
    if (!isOpen || !closeOnEscapeFlag || !isTop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscapeFlag, handleClose, isOpen, isTop]);

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClickFlag || !isTop) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClickFlag, handleClose, isOpen, isTop]);

  return (
    <AnimatePresence onExitComplete={unmount}>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center ${
            dimmed ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{ zIndex }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-${id}-title`}
          aria-describedby={description ? `modal-${id}-description` : undefined}
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
            className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl pointer-events-auto"
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}) satisfies DialogComponent<ModalDialogProps, DialogBehaviorOptions>;
