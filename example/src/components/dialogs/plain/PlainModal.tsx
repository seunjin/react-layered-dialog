import { useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import type { PlainModalDialogState } from '@/lib/dialogs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLayerBehavior } from 'react-layered-dialog';
import { cn } from '@/lib/utils';

type PlainModalProps = DialogState<PlainModalDialogState>;

export const PlainModal = ({
  id,
  title,
  description,
  body,
  zIndex,
  canDismiss = true,
  dismissable,
  closeOnOutsideClick,
  dimmed = true,
}: PlainModalProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);
  const dismissableFlag = dismissable ?? canDismiss;
  const outsideClickFlag = closeOnOutsideClick ?? dismissableFlag;

  const handleClose = useCallback(() => {
    closeDialog(id);
  }, [closeDialog, id]);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    closeOnEscape: dismissableFlag,
    onEscape: handleClose,
    closeOnOutsideClick: outsideClickFlag,
    onOutsideClick: handleClose,
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
      aria-labelledby={`plain-modal-${id}-title`}
      aria-describedby={
        description ? `plain-modal-${id}-description` : undefined
      }
    >
      <div
        ref={panelRef}
        className="pointer-events-auto relative w-full max-w-lg rounded-lg border border-border bg-white p-6 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={`plain-modal-${id}-title`}
              className="text-xl font-semibold"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={`plain-modal-${id}-description`}
                className="mt-1 text-sm text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          {canDismiss ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </header>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          {body}
        </div>
      </div>
    </div>
  );
};
