import Confirm from '@/components/dialogs/Confirm';
import { DialogStore, createDialogApi } from 'react-layered-dialog';

/**
 * 리뉴얼 데모에서 사용할 전역 다이얼로그 스토어입니다.
 * 애플리케이션 어디에서든 동일한 인스턴스를 공유합니다.
 */
export const dialogStore = new DialogStore();

/**
 * 등록된 다이얼로그 정의를 기반으로 생성된 고수준 API입니다.
 * - `dialogStore.confirm(...)`
 * - `dialogStore.open(...)`
 * - `dialogStore.openAsync(...)` 등
 */
export const dialog = createDialogApi(dialogStore, {
  confirm: { component: Confirm, mode: 'async' },
});
export const renewalDialog = dialog;

// 사용 편의를 위해 저수준 함수도 함께 노출합니다.
export const openDialog = dialogStore.open;
export const openDialogAsync = dialogStore.openAsync;
export const closeDialog = dialogStore.close;
export const unmountDialog = dialogStore.unmount;
export const updateDialog = dialogStore.updateState;
