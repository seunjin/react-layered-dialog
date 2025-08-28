import { close } from './lib/dialogs';
import type { AlertState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';

type AlertProps = DialogState<AlertState>;

export const Alert = ({ id, title, message, onOk }: AlertProps) => {
  const handleConfirm = () => {
    onOk?.();
    close(id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <div className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
