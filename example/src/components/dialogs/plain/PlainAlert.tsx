import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  useDialogController,
  type DialogComponent,
} from 'react-layered-dialog';
import type {
  DialogBehaviorOptions,
  PlainAlertDialogProps,
} from '@/lib/dialogs';
import { cn } from '@/lib/utils';

export const PlainAlert = ((props: PlainAlertDialogProps) => {
  const controller = useDialogController<
    PlainAlertDialogProps,
    DialogBehaviorOptions
  >();
  const { id, options, close, unmount, getStateFields, stack } = controller;
  const panelRef = useRef<HTMLDivElement>(null);

  const { title, message, onOk } = getStateFields({
    title: props.title,
    message: props.message,
    onOk: props.onOk,
  });

  const closeOnEscape = options.closeOnEscape ?? true;
  const closeOnOutsideClick = options.closeOnOutsideClick ?? true;
  const dimmed = options.dimmed ?? true;
  const zIndex = options.zIndex;
  const isTop = stack.index === stack.size - 1;

  const handleClose = useCallback(() => {
    onOk?.();
    close();
    unmount();
  }, [close, onOk, unmount]);

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

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center transition-none',
        dimmed
          ? 'bg-black/40 pointer-events-auto'
          : 'bg-transparent pointer-events-none'
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
        <p
          id={`plain-alert-${id}-message`}
          className="mt-2 text-sm text-muted-foreground"
        >
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
}) satisfies DialogComponent<PlainAlertDialogProps, DialogBehaviorOptions>;
