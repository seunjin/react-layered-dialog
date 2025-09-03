import { useEffect, useCallback, useRef } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { ConfirmState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { Button } from '@/components/ui/button';

type ConfirmProps = DialogState<ConfirmState>;

export const Confirm = ({
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = false,
  dismissable = false,
}: ConfirmProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // '취소' 버튼 클릭 또는 Escape 키 입력 시 실행될 콜백 함수
  const handleCancel = useCallback(() => {
    // onCancel prop이 있으면 실행, 없으면 기본 closeDialog 호출
    if (onCancel) {
      onCancel();
    } else {
      closeDialog();
    }
  }, [onCancel, closeDialog]);

  // '확인' 버튼 클릭 시 실행될 콜백 함수
  const handleConfirm = () => {
    onConfirm?.();
  };

  // 키보드 이벤트(Escape) 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopDialog =
        dialogs.length > 0 &&
        dialogs[dialogs.length - 1].state.zIndex === zIndex;
      if (event.key === 'Escape' && dismissable && isTopDialog) {
        handleCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dismissable, handleCancel, dialogs, zIndex]);

  // 다이얼로그가 열렸을 때 확인 버튼에 자동으로 포커스
  useEffect(() => {
    confirmButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      {/* 오버레이(배경) */}
      <div
        className={`absolute inset-0 ${dimmed ? 'bg-black/20' : 'bg-transparent'}`}
        onClick={() => closeOnOverlayClick && handleCancel()}
      />
      {/* 다이얼로그 본문 */}
      <div className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]">
        <h3 id="confirm-title" className="text-lg font-bold">
          {title}
        </h3>
        <p id="confirm-message" className="mt-2 text-sm text-gray-500">
          {message}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button ref={confirmButtonRef} onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
