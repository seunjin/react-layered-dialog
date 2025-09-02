import { useEffect, useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { AlertState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

type AlertProps = DialogState<AlertState>;

export const Alert = ({
  title,
  message,
  onOk,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = false,
  dismissable = false,
}: AlertProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const okButtonRef = useRef<HTMLButtonElement>(null);

  // '확인' 버튼 클릭 시 실행될 콜백 함수
  const handleOk = useCallback(() => {
    onOk?.();
    closeDialog();
  }, [onOk, closeDialog]);

  // 키보드 이벤트(Escape) 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 최상단 다이얼로그가 아닐 경우 무시
      const isTopDialog =
        dialogs.length > 0 &&
        dialogs[dialogs.length - 1].state.zIndex === zIndex;
      if (event.key === 'Escape' && dismissable && isTopDialog) {
        handleOk();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dismissable, handleOk, dialogs, zIndex]);

  // 다이얼로그가 열렸을 때 확인 버튼에 자동으로 포커스
  useEffect(() => {
    okButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
    >
      {/* 오버레이(배경) */}
      <motion.div
        className={`absolute inset-0 ${dimmed ? 'bg-black/20' : 'bg-transparent'}`}
        onClick={() => closeOnOverlayClick && handleOk()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      {/* 다이얼로그 본문 */}
      <motion.div
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <h3 id="alert-title" className="text-lg font-bold">
          {title}
        </h3>
        <p id="alert-message" className="mt-2 text-sm text-gray-500">
          {message}
        </p>
        <div className="mt-4 flex justify-end">
          <Button ref={okButtonRef} onClick={handleOk}>
            확인
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
