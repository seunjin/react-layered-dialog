import { createContext, useContext } from 'react';
import type { DialogControllerContextValue } from './types';

/**
 * 내부 컨트롤러 컨텍스트입니다. `DialogsRenderer`가 각 다이얼로그 렌더링 시 값을 주입하고,
 * 사용자 쪽 훅은 이 컨텍스트를 통해 상태/제어 함수를 획득합니다.
 */
const DialogControllerContext = createContext<DialogControllerContextValue | null>(null);

export const DialogControllerProvider = DialogControllerContext.Provider;

/**
 * 컨트롤러 컨텍스트를 안전하게 구독하는 내부 훅입니다. 컨텍스트가 없을 경우 명확한 에러를 던져
 * 잘못된 사용(렌더러 외부에서 훅 호출 등)을 조기에 감지합니다.
 */
export function useDialogControllerInternal() {
  const context = useContext(DialogControllerContext);
  if (!context) {
    throw new Error('useDialogController must be used within a dialog controller context.');
  }
  return context;
}
