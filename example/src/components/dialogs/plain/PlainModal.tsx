import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  useDialogController,
  type DialogComponent,
} from 'react-layered-dialog';
import type { PlainModalDialogProps } from '@/lib/dialogs';
import { cn } from '@/lib/utils';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export const PlainModal = ((props: PlainModalDialogProps) => {
  const controller = useDialogController<PlainModalDialogProps>();
  const { id, isOpen, zIndex, close, unmount, getStateFields, stack } =
    controller;
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    title,
    description,
    body,
    canDismiss,
    onClose,
    dimmed = true,
    closeOnEscape = canDismiss ?? false,
    closeOnOutsideClick = closeOnEscape,
    scrollLock = true,
  } = getStateFields({
    title: props.title,
    description: props.description,
    body: props.body,
    canDismiss: props.canDismiss ?? true,
    onClose: props.onClose,
    dimmed: props.dimmed ?? true,
    closeOnEscape: props.closeOnEscape ?? props.canDismiss ?? false,
    closeOnOutsideClick:
      props.closeOnOutsideClick ?? props.closeOnEscape ?? props.canDismiss ?? false,
    scrollLock: props.scrollLock ?? true,
  });

  const isTop = stack.index === stack.size - 1;

  const handleClose = useCallback(() => {
    onClose?.();
    close();
    unmount();
  }, [close, onClose, unmount]);

  useEffect(() => {
    if (!closeOnEscape || !isTop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, handleClose, isTop]);

  useEffect(() => {
    if (!closeOnOutsideClick || !isTop) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClick, handleClose, isTop]);

  useBodyScrollLock(scrollLock && isOpen);

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
}) satisfies DialogComponent<PlainModalDialogProps>;
