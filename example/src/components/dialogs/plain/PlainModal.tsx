import { useCallback, useEffect, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import type { PlainModalDialogState } from '@/lib/dialogs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLayerBehavior } from 'react-layered-dialog';

type PlainModalProps = DialogState<PlainModalDialogState>;

export const PlainModal = ({
  id,
  title,
  description,
  body,
  footer,
  zIndex,
  canDismiss = true,
}: PlainModalProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    closeDialog(id);
  }, [closeDialog, id]);

  useEffect(() => {
    if (canDismiss) {
      closeButtonRef.current?.focus();
    }
  }, [canDismiss]);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    closeOnEscape: canDismiss,
    onEscape: handleClose,
    closeOnOutsideClick: canDismiss,
    onOutsideClick: handleClose,
    outsideClickRef: panelRef,
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 transition-none"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`plain-modal-${id}-title`}
      aria-describedby={description ? `plain-modal-${id}-description` : undefined}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-lg border border-border bg-white p-6 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`plain-modal-${id}-title`} className="text-xl font-semibold">
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
        <div className="mt-4 space-y-4 text-sm text-muted-foreground">{body}</div>
        {footer ? <footer className="mt-6 text-sm text-muted-foreground">{footer}</footer> : null}
      </div>
    </div>
  );
};
