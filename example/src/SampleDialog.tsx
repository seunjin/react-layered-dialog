import { dialogManager } from './lib/dialogs';
import type { CustomDialogState } from './lib/dialogs';

// The component now receives the entire state object as its props.
type SampleDialogProps = CustomDialogState;

const dialogStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '16px',
  margin: '8px',
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  position: 'relative',
  minWidth: '300px',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '16px',
};

export const SampleDialog = (props: SampleDialogProps) => {
  return (
    <div style={dialogStyle}>
      <button
        style={closeButtonStyle}
        onClick={() => dialogManager.close(props.id)}
      >
        &times;
      </button>
      <h3>{props.title}</h3>
      <p>{props.message}</p>

      <small>Overlay: {props.useOverlay ? 'On' : 'Off'}</small>
    </div>
  );
};
