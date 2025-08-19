import { dialogManager } from './lib/dialogs';
import type { CustomDialogState } from './lib/dialogs';
import type { DialogState } from 'react-layered-dialog';

// The component now receives the full internal state object as its props.
type SampleDialogProps = DialogState<CustomDialogState>;

export const SampleDialog = (props: SampleDialogProps) => {
  return (
    <>
      {props.useOverlay && <div className="fixed inset-0 bg-black/20" />}
      <div className="relative border border-gray-300 p-4 m-2 rounded-lg bg-white shadow-lg w-full max-w-[300px] mx-auto">
        <button
          className="absolute top-2 right-2 border-none bg-transparent cursor-pointer text-lg"
          onClick={() => dialogManager.close(props.id)}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-2">{props.title}</h3>
        <p className="mb-4">{props.message}</p>

        <small>Overlay: {props.useOverlay ? 'On' : 'Off'}</small>
      </div>
    </>
  );
};
