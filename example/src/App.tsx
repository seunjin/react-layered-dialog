import { dialogManager, useDialogs } from './lib/dialogs';
import { SampleDialog } from './SampleDialog';
import type { DialogInstance } from 'react-layered-dialog'; // Import DialogInstance
import type { CustomDialogState } from './lib/dialogs'; // Import CustomDialogState

// Styles for the container and dialog wrapper
const appStyle: React.CSSProperties = {
  fontFamily: 'sans-serif',
  padding: '16px',
};

const dialogContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '10vh',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  pointerEvents: 'none',
};

const dialogWrapperStyle: React.CSSProperties = {
  pointerEvents: 'auto',
};

function App() {
  // Explicitly type the dialogs variable
  const dialogs: DialogInstance<CustomDialogState>[] = useDialogs();
  console.log(dialogs);

  const handleOpenAlert = () => {
    dialogManager.open(SampleDialog, {
      type: 'alert',
      title: 'Alert Dialog',
      message: 'This is an alert with a default overlay.',
    });
  };

  const handleOpenConfirm = () => {
    dialogManager.open(SampleDialog, {
      type: 'confirm',
      title: 'Confirm Dialog',
      message: 'This is a confirm dialog.',
      // We can override defaults
      useOverlay: true,
    });
  };

  return (
    <div style={appStyle}>
      <h1>React Layered Dialog - Final Example</h1>
      <p>Click the buttons to open different types of dialogs.</p>
      <button onClick={handleOpenAlert}>Open Alert</button>
      <button onClick={handleOpenConfirm} style={{ marginLeft: '8px' }}>
        Open Confirm
      </button>

      {/* Render the dialogs */}
      {dialogs.length > 0 && (
        <div style={dialogContainerStyle}>
          {dialogs.map((dialog) => (
            <div key={dialog.state.id} style={dialogWrapperStyle}>
              {/* Pass the entire state object to the component */}
              <dialog.Component {...dialog.state} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
