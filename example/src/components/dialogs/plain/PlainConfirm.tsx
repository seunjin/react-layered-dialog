import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  useDialogController,
  type DialogComponent,
} from 'react-layered-dialog';
import type {
  DialogBehaviorOptions,
  PlainConfirmDialogProps,
} from '@/lib/dialogs';
import { cn } from '@/lib/utils';

export const PlainConfirm = ((props: PlainConfirmDialogProps) => {
  const controller = useDialogController<
    PlainConfirmDialogProps,
    DialogBehaviorOptions
  >();
  const { id, options, close, unmount, getStateFields, stack } = controller;
  const panelRef = useRef<HTMLDivElement>(null);

  const { title, message, onConfirm, onCancel } = getStateFields({
    title: props.title,
    message: props.message,
    onConfirm: props.onConfirm,
    onCancel: props.onCancel,
  });

  const closeOnEscape = options.closeOnEscape ?? true;
  const closeOnOutsideClick = options.closeOnOutsideClick ?? true;
  const dimmed = options.dimmed ?? true;
  const zIndex = options.zIndex;
  const isTop = stack.index === stack.size - 1;

  const handleCancel = useCallback(() => {
    onCancel?.();
    close();
    unmount();
  }, [close, onCancel, unmount]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    close();
    unmount();
  }, [close, onConfirm, unmount]);

  useEffect(() => {
    if (!closeOnEscape || !isTop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, handleCancel, isTop]);

  useEffect(() => {
    if (!closeOnOutsideClick || !isTop) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClick, handleCancel, isTop]);

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
}) satisfies DialogComponent<PlainConfirmDialogProps, DialogBehaviorOptions>;
