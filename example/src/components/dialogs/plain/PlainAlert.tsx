import { useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import type { PlainAlertDialogState } from '@/lib/dialogs';
import { Button } from '@/components/ui/button';
import { useLayerBehavior } from 'react-layered-dialog';
import { cn } from '@/lib/utils';

type PlainAlertProps = DialogState<PlainAlertDialogState>;

export const PlainAlert = ({
  id,
  title,
  message,
  onOk,
  zIndex,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  dimmed = true,
}: PlainAlertProps) => {
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
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center transition-none',
        dimmed ? 'bg-black/40 pointer-events-auto' : 'bg-transparent pointer-events-none'
      )}
      style={{ zIndex }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`plain-alert-${id}-title`}
      aria-describedby={`plain-alert-${id}-message`}
    >
      <div
        ref={panelRef}
        className="pointer-events-auto relative min-w-[280px] rounded-lg border border-border bg-white p-6 shadow-lg"
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
