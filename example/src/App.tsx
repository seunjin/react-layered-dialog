import { dialogManager, useDialogsState } from './lib/dialogs';
import { SampleDialog } from './SampleDialog';
import type { CustomDialogState } from './lib/dialogs';
import type { DialogInstance } from 'react-layered-dialog';

function App() {
  const dialogs: DialogInstance<CustomDialogState>[] = useDialogsState();
  console.log(dialogs);

  const handleOpenAlert = () => {
    dialogManager.open(SampleDialog, {
      type: 'alert',
      title: 'Alert Dialog',
      message: 'This is the first dialog.',
      useOverlay: true,
      closeOnOutsideClick: true,
    });
  };

  const handleOpenConfirm = () => {
    dialogManager.open(SampleDialog, {
      type: 'confirm',
      title: 'Confirm Dialog',
      message: 'This is a confirm dialog.',
      useOverlay: true,
    });
  };

  return (
    <div className="font-sans p-4">
      <h1 className="text-2xl font-bold mb-4">
        React Layered Dialog - Final Example
      </h1>
      <p className="mb-4">
        Click the buttons to open different types of dialogs.
      </p>
      <button
        onClick={handleOpenAlert}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      >
        Open Alert
      </button>
      <button
        onClick={handleOpenConfirm}
        className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
      >
        Open Confirm
      </button>

      {/* Render the dialogs */}
      {dialogs.length > 0 &&
        dialogs.map((dialog) => (
          <dialog.Component key={dialog.state.id} {...dialog.state} />
        ))}
    </div>
  );
}

export default App;
