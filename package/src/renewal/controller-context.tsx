import { createContext, useContext } from 'react';
import type { DialogControllerContextValue } from './types';

/**
 * 다이얼로그 컨트롤러 값을 제공하는 React Context입니다.
 * open/openAsync가 생성한 다이얼로그 트리 내부에서만 접근 가능합니다.
 */
const DialogControllerContext = createContext<DialogControllerContextValue | null>(null);

export const DialogControllerProvider = DialogControllerContext.Provider;

/**
 * 컨트롤러 컨텍스트를 읽어오는 내부 훅.
 * 컨텍스트가 없으면 명확한 에러를 던집니다.
 */
export function useDialogControllerInternal(): DialogControllerContextValue {
  const value = useContext(DialogControllerContext);
  if (!value) {
    throw new Error('useDialogController must be used within a dialog controller context.');
  }
  return value;
}
