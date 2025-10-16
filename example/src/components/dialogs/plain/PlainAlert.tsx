import { useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import type { PlainAlertDialogState } from '@/lib/dialogs';
import { Button } from '@/components/ui/button';
import { useLayerBehavior } from 'react-layered-dialog';

type PlainAlertProps = DialogState<PlainAlertDialogState>;

export const PlainAlert = ({ id, title, message, onOk, zIndex }: PlainAlertProps) => {
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
    closeOnEscape: true,
    onEscape: handleClose,
    closeOnOutsideClick: true,
    onOutsideClick: handleClose,
    outsideClickRef: panelRef,
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 transition-none"
      style={{ zIndex }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`plain-alert-${id}-title`}
      aria-describedby={`plain-alert-${id}-message`}
    >
      <div
        ref={panelRef}
        className="min-w-[280px] rounded-lg border border-border bg-white p-6 shadow-lg"
      >
        <h3 id={`plain-alert-${id}-title`} className="text-lg font-semibold">
          {title}
        </h3>
        <p id={`plain-alert-${id}-message`} className="mt-2 text-sm text-muted-foreground">
          {message}
        </p>
        <div className="mt-4 flex justify-end">
          <Button autoFocus onClick={handleClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
