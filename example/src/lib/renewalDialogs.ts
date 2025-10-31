import {
  DialogStore,
  type DialogRenderFn,
  type DialogId,
  type OpenDialogOptions,
  type OpenDialogResult,
} from 'react-layered-dialog';

/**
 * 리뉴얼 다이얼로그 데모 페이지에서 사용할 전역 스토어입니다.
 * 앱 어디에서든 import 해 동일한 스택을 공유합니다.
 */
export const renewalDialogStore = new DialogStore();

/**
 * JSX 기반 다이얼로그를 연다.
 *
 * @example
 * openRenewalDialog(() => <MyDialog />);
 */
export const openRenewalDialog = <
  TState = unknown,
  TOptions extends Record<string, unknown> = Record<string, unknown>
>(
  renderer: DialogRenderFn<TState, TOptions>,
  options?: OpenDialogOptions<TOptions>
): OpenDialogResult => {
  return renewalDialogStore.open(renderer, options);
};

/**
 * 현재 열린 다이얼로그를 닫거나(인자 없음) 특정 ID의 다이얼로그를 닫습니다.
 */
export const closeRenewalDialog = (id?: DialogId) => {
  renewalDialogStore.close(id);
};

/**
 * 다이얼로그를 스택에서 제거합니다.
 */
export const unmountRenewalDialog = (id?: DialogId) => {
  renewalDialogStore.unmount(id);
};

type UpdateStateArg = Parameters<typeof renewalDialogStore.updateState>[1];

/**
 * 다이얼로그 상태를 외부에서 갱신하고 싶을 때 사용합니다.
 */
export const updateRenewalDialog = (id: DialogId, updater: UpdateStateArg) => {
  renewalDialogStore.updateState(id, updater);
};
