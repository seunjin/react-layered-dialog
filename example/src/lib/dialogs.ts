import {
  createDialogManager,
  type BaseDialogState,
} from 'react-layered-dialog';

// 1. Define the app-specific state for all dialogs
export interface CustomDialogState extends BaseDialogState {
  id: string; // Added
  isOpen: boolean; // Added
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  useOverlay?: boolean;
}

// 2. Create the dialog management system using the factory
export const { manager: dialogManager, useDialogs } =
  createDialogManager<CustomDialogState>({
    // 3. Define default state properties for different dialog types
    defaults: {
      alert: {
        useOverlay: true,
      },
      confirm: {
        useOverlay: true,
      },
    },
  });
