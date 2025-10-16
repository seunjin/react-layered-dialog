import { useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import type { PlainConfirmDialogState } from '@/lib/dialogs';
import { Button } from '@/components/ui/button';
import { useLayerBehavior } from 'react-layered-dialog';

type PlainConfirmProps = DialogState<PlainConfirmDialogState>;

export const PlainConfirm = ({
  id,
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
}: PlainConfirmProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleCancel = useCallback(() => {
    onCancel?.();
    closeDialog(id);
  }, [closeDialog, id, onCancel]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    closeDialog(id);
  }, [closeDialog, id, onConfirm]);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    closeOnEscape: true,
    onEscape: handleCancel,
    closeOnOutsideClick: true,
    onOutsideClick: handleCancel,
    outsideClickRef: panelRef,
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 transition-none"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`plain-confirm-${id}-title`}
      aria-describedby={`plain-confirm-${id}-message`}
    >
      <div
        ref={panelRef}
        className="min-w-[320px] rounded-lg border border-border bg-white p-6 shadow-lg"
      >
        <h3 id={`plain-confirm-${id}-title`} className="text-lg font-semibold">
          {title}
        </h3>
        <p
          id={`plain-confirm-${id}-message`}
          className="mt-2 text-sm text-muted-foreground"
        >
          {message}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button autoFocus onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
