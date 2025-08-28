import { createDialogManager } from 'react-layered-dialog';

// 1. Define the app-specific state for all dialogs
export interface CustomDialogState {
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  useOverlay?: boolean;
  closeOnOutsideClick?: boolean;
}

// 2. Create the dialog management system using the factory
export const { manager: dialogManager, useDialogsState } =
  createDialogManager<CustomDialogState>();
