import Confirm from '@/components/dialogs/Confirm';
import { DialogStore, createDialogApi } from 'react-layered-dialog';

/**
 * 리뉴얼 데모에서 사용할 전역 다이얼로그 스토어입니다.
 * 애플리케이션 어디에서든 동일한 인스턴스를 공유합니다.
 */
// export const dialog = new DialogStore();

/**
 * 등록된 다이얼로그 정의를 기반으로 생성된 고수준 API입니다.
 * - `dialogStore.confirm(...)`
 * - `dialogStore.open(...)`
 * - `dialogStore.openAsync(...)` 등
 */
export const dialog = createDialogApi(new DialogStore(), {
  confirm: { component: Confirm, mode: 'async' },
});
export const renewalDialog = dialog;

// 사용 편의를 위해 저수준 함수도 함께 노출합니다.
export const openDialog = dialog.open;
export const openDialogAsync = dialog.openAsync;
export const closeDialog = dialog.close;
export const unmountDialog = dialog.unmount;
export const updateDialog = dialog.update;
export const openConfirm = dialog.confirm;
