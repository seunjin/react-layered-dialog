import { useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';
import type { ConfirmDialogState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { useLayerBehavior } from 'react-layered-dialog';

type ConfirmProps = DialogState<ConfirmDialogState>;

export const Confirm = ({
  id,
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
  dismissable = true,
  closeOnOutsideClick = true,
  dimmed = true,
  step = 'confirm',
}: ConfirmProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);

  const isLoading = step === 'loading';
  const isDone = step === 'done';

  const handleCancel = useCallback(() => {
    if (!onCancel || isLoading) return;
    const shouldClose = onCancel();
    if (shouldClose !== false) {
      closeDialog(id);
    }
  }, [closeDialog, id, isLoading, onCancel]);

  const handleConfirm = useCallback(() => {
    if (isLoading) return;
    if (!onConfirm) {
      closeDialog(id);
      return;
    }
    const shouldClose = onConfirm();
    if (shouldClose !== false) {
      closeDialog(id);
    }
  }, [closeDialog, id, isLoading, onConfirm]);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    closeOnEscape: dismissable,
    onEscape: handleCancel,
    closeOnOutsideClick,
    onOutsideClick: handleCancel,
    outsideClickRef: panelRef,
  });

  return (
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
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
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
  );
};
