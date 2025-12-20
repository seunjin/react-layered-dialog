import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  useDialogController,
  type DialogComponent,
  type DialogControllerContextValue,
} from 'react-layered-dialog';
import { Spinner } from '@/components/ui/spinner';
import { AnimatePresence } from 'motion/react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export type ConfirmController = DialogControllerContextValue<ConfirmProps>;

export type ConfirmProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  dimmed?: boolean;
  scrollLock?: boolean;
};

/**
 * 리뉴얼 데모에서 재사용하는 컨펌 다이얼로그입니다.
 * `openDialog`와 `openDialogAsync` 모두에서 사용할 수 있도록
 * 기본 동작과 `resolve` 기반 비동기 제어를 함께 지원합니다.
 */
const Confirm: DialogComponent<ConfirmProps> = ((props: ConfirmProps) => {
  const controller = useDialogController<ConfirmProps>();

  const {
    isOpen,
    resolve,
    reject,
    close,
    unmount,
    status,
    getProps,
    zIndex,
  } = controller;

  const isLoading = status === 'loading';

  const {
    title = '',
    message = '',
    confirmLabel = '확인',
    cancelLabel = '취소',
    onConfirm,
    onCancel,
    dimmed = true,
    scrollLock = true,
  } = getProps(props);

  const handleConfirm = async () => {
    if (isLoading) return;

    if (onConfirm) {
      try {
        await Promise.resolve(onConfirm());
      } catch (error) {
        reject?.(error);
      }
      return;
    }

    resolve?.({ ok: true });
    close();
  };

  const handleCancel = async () => {
    if (isLoading) return;

    if (onCancel) {
      try {
        await Promise.resolve(onCancel());
      } catch (error) {
        reject?.(error);
      }
      return;
    }

    resolve?.({ ok: false });
    close();
  };

  useBodyScrollLock(scrollLock && isOpen);

  return (
    /**
     * [Standard Pattern]
     * close()는 상태만 변경하고, 실제 DOM 제거(unmount)는 
     * 애니메이션이 완전히 끝난 시점(onExitComplete)에 수행하는 것이 권장됩니다.
     */
    <AnimatePresence onExitComplete={unmount}>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 flex items-center justify-center ${dimmed ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          initial={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            backdropFilter: 'blur(0px)',
          }}
          animate={{
            backgroundColor: dimmed ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)',
            backdropFilter: 'blur(4px)',
          }}
          exit={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            backdropFilter: 'blur(0px)',
          }}
          style={{ zIndex }}
        >
          <motion.div
            className="w-[min(340px,90%)] space-y-4 rounded-xl bg-card p-6 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <header className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </header>

            <div className="flex justify-end gap-2">
              {status !== 'done' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={handleCancel}
                >
                  {cancelLabel}
                </Button>
              )}
              <Button size="sm" disabled={isLoading} onClick={handleConfirm}>
                {isLoading && <Spinner />} {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}) satisfies DialogComponent<ConfirmProps>;

export default Confirm;
