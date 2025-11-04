import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  useDialogController,
  type DialogComponent,
} from 'react-layered-dialog';
import type { ConfirmDialogProps, DialogBehaviorOptions } from '@/lib/dialogs';

export const Confirm = ((props: ConfirmDialogProps) => {
  const controller = useDialogController<
    ConfirmDialogProps,
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

  const { title, message, onConfirm, onCancel, step } = getStateFields({
    title: props.title,
    message: props.message,
    onConfirm: props.onConfirm,
    onCancel: props.onCancel,
    step: props.step ?? 'confirm',
  });

  const safeStep = step ?? 'confirm';
  const isLoading = safeStep === 'loading';
  const isDone = safeStep === 'done';

  const handleCancel = useCallback(() => {
    if (!onCancel || isLoading) return;
    const shouldClose = onCancel();
    if (shouldClose !== false) {
      close();
    }
  }, [close, isLoading, onCancel]);

  const handleConfirm = useCallback(() => {
    if (isLoading) return;
    if (!onConfirm) {
      close();
      return;
    }
    const shouldClose = onConfirm();
    if (shouldClose !== false) {
      close();
    }
  }, [close, isLoading, onConfirm]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape || !isTop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, handleCancel, isOpen, isTop]);

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || !isTop) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClick, handleCancel, isOpen, isTop]);

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
          aria-labelledby={`confirm-${id}-title`}
          aria-describedby={`confirm-${id}-message`}
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
            className="relative min-w-[320px] rounded-lg bg-white p-6 shadow-xl pointer-events-auto"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
          >
            <h3 id={`confirm-${id}-title`} className="text-lg font-semibold">
              {title}
            </h3>
            <p
              id={`confirm-${id}-message`}
              className="mt-2 text-sm text-muted-foreground"
            >
              {message}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              {onCancel && !isDone ? (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  취소
                </Button>
              ) : null}
              <Button autoFocus onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    진행 중...
                  </span>
                ) : isDone ? (
                  '닫기'
                ) : (
                  '확인'
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}) satisfies DialogComponent<ConfirmDialogProps, DialogBehaviorOptions>;
