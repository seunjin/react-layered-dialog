import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  useDialogController,
  type DialogComponent,
} from 'react-layered-dialog';
import type { AlertDialogProps, DialogBehaviorOptions } from '@/lib/dialogs';

export const Alert = ((props: AlertDialogProps) => {
  const controller = useDialogController<
    AlertDialogProps,
    DialogBehaviorOptions
  >();
  const { id, isOpen, options, close, unmount, getStateFields, stack } =
    controller;
  const panelRef = useRef<HTMLDivElement>(null);

  const closeOnEscape = options.closeOnEscape ?? true;
  const closeOnOutsideClick = options.closeOnOutsideClick ?? true;
  const dimmed = options.dimmed ?? true;
  const zIndex = options.zIndex;
  const isTop = stack.index === stack.size - 1;

  const { title, message, onOk } = getStateFields({
    title: props.title,
    message: props.message,
    onOk: props.onOk,
  });

  const handleClose = useCallback(() => {
    onOk?.();
    close();
  }, [onOk, close]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape || !isTop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, handleClose, isOpen, isTop]);

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || !isTop) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClick, handleClose, isOpen, isTop]);

  return (
    <AnimatePresence onExitComplete={unmount}>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 flex items-center justify-center ${
            dimmed ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{ zIndex }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`alert-${id}-title`}
          aria-describedby={`alert-${id}-message`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
      )}
    </AnimatePresence>
  );
}) satisfies DialogComponent<AlertDialogProps, DialogBehaviorOptions>;
