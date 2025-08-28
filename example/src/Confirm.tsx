import { close } from './lib/dialogs';
import type { ConfirmState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';

type ConfirmProps = DialogState<ConfirmState>;

export const Confirm = ({
  id,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmProps) => {
  const handleConfirm = () => {
    // "확인" 버튼은 이제 onConfirm 콜백만 실행합니다.
    // 다이얼로그를 닫는 책임은 onConfirm 함수를 구현한 쪽에 있습니다.
    onConfirm?.();
  };

  const handleCancel = () => {
    if (onCancel) {
      // onCancel 콜백이 있으면, 닫기를 포함한 모든 제어권을 위임합니다.
      onCancel();
    } else {
      // onCancel 콜백이 없으면, 기본 동작으로 다이얼로그를 닫습니다.
      close(id);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <div className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
