import { close } from './lib/dialogs';
import type { ModalState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';

type ModalProps = DialogState<ModalState>;

export const Modal = ({ id, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <div className="relative rounded-lg bg-white p-6 shadow-lg min-w-[400px]">
        <div className="absolute top-2 right-2">
          <button
            onClick={() => close(id)}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
