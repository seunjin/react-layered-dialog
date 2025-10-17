import { useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import type { PlainConfirmDialogState } from '@/lib/dialogs';
import { Button } from '@/components/ui/button';
import { useLayerBehavior } from 'react-layered-dialog';
import { cn } from '@/lib/utils';

type PlainConfirmProps = DialogState<PlainConfirmDialogState>;

export const PlainConfirm = ({
  id,
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  dimmed = true,
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
    closeOnEscape,
    onEscape: handleCancel,
    closeOnOutsideClick,
    onOutsideClick: handleCancel,
    outsideClickRef: panelRef,
  });

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center transition-none',
        dimmed
          ? 'bg-black/40 pointer-events-auto'
          : 'bg-transparent pointer-events-none'
      )}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`plain-confirm-${id}-title`}
      aria-describedby={`plain-confirm-${id}-message`}
    >
      <div
        ref={panelRef}
        className="pointer-events-auto relative min-w-[320px] rounded-lg border border-border bg-white p-6 shadow-lg"
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
