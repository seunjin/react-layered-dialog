import { useEffect, useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { AlertState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
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
      <div
        className={`absolute inset-0 ${dimmed ? 'bg-black/20' : 'bg-transparent'}`}
        onClick={() => closeOnOverlayClick && handleOk()}
      />
      {/* 다이얼로그 본문 */}
      <div className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]">
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
      </div>
    </div>
  );
};
