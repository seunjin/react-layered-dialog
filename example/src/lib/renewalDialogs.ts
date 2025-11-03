import { DialogStore, createDialogApi } from 'react-layered-dialog';
import RenewalConfirm from '@/components/dialogs/renewal/RenewalConfirm';

/**
 * 리뉴얼 데모에서 사용할 전역 다이얼로그 스토어입니다.
 * 애플리케이션 어디에서든 동일한 인스턴스를 공유합니다.
 */
export const renewalDialogStore = new DialogStore();

/**
 * 등록된 다이얼로그 정의를 기반으로 생성된 고수준 API입니다.
 * - `renewalDialog.confirm(...)`
 * - `renewalDialog.open(...)`
 * - `renewalDialog.openAsync(...)` 등
 */
export const renewalDialog = createDialogApi(renewalDialogStore, {
  confirm: { component: RenewalConfirm, mode: 'async' },
});

// 사용 편의를 위해 저수준 함수도 함께 노출합니다.
export const openDialog = renewalDialog.open;
export const openDialogAsync = renewalDialog.openAsync;
export const closeDialog = renewalDialog.close;
export const unmountDialog = renewalDialog.unmount;
export const updateDialog = renewalDialog.update;
