import { useEffect, useRef, useCallback } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import type { PlainAlertDialogState } from '@/lib/dialogs';
import { Button } from '@/components/ui/button';
import { useLayerBehavior } from 'react-layered-dialog';

type PlainAlertProps = DialogState<PlainAlertDialogState>;

export const PlainAlert = ({ id, title, message, onOk, zIndex }: PlainAlertProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const okButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onOk?.();
    closeDialog(id);
  }, [closeDialog, id, onOk]);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    autoFocus: true,
    focusRef: okButtonRef,
    closeOnEscape: true,
    onEscape: handleClose,
    closeOnOutsideClick: true,
    onOutsideClick: handleClose,
    outsideClickRef: panelRef,
  });

  useEffect(() => {
    okButtonRef.current?.focus();
  }, []);

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
          <Button ref={okButtonRef} onClick={handleClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
