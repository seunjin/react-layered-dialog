import { createContext, useContext } from 'react';
import type { DialogControllerContextValue } from './types';

const DialogControllerContext = createContext<DialogControllerContextValue | null>(null);

export const DialogControllerProvider = DialogControllerContext.Provider;

export function useDialogControllerInternal() {
  const context = useContext(DialogControllerContext);
  if (!context) {
    throw new Error('useDialogController must be used within a dialog controller context.');
  }
  return context;
}
