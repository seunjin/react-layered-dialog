import { dialogManager } from './lib/dialogs';
import type { CustomDialogState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';

// The component now receives the full internal state object as its props.
type SampleDialogProps = DialogState<CustomDialogState>;

export const SampleDialog = (props: SampleDialogProps) => {
  const {
    id,
    title,
    message,
    useOverlay = false,
    closeOnOutsideClick = false,
  } = props;

  const handleOpenNested = () => {
    dialogManager.open(SampleDialog, {
      type: 'confirm',
      title: `Nested Dialog`,
      message: 'This dialog is nested.',
      useOverlay: true,
      closeOnOutsideClick: true,
    });
  };

  const handleOutsideClick = () => {
    if (closeOnOutsideClick) {
      dialogManager.close(id);
    }
  };

  return (
    <div className="fixed flex items-center justify-center inset-0">
      <div
        className={`absolute inset-0 ${useOverlay ? 'bg-black/20' : ''}`}
        onClick={handleOutsideClick}
      />
      <div className="relative border border-gray-300 p-4 m-2 rounded-lg bg-white shadow-lg min-w-[300px]">
        <button
          className="absolute top-2 right-2 border-none bg-transparent cursor-pointer text-lg"
          onClick={() => dialogManager.close(id)}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="mb-4">{message}</p>

        <div className="flex justify-between items-center">
          <button
            onClick={handleOpenNested}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Open Nested
          </button>
        </div>
      </div>
    </div>
  );
};
