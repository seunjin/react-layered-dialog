import Confirm from '@/components/dialogs/Confirm';
import { DialogStore, createDialogApi } from 'react-layered-dialog';

/**
 * 리뉴얼 데모에서 사용할 전역 다이얼로그 스토어입니다.
 * 애플리케이션 어디에서든 동일한 인스턴스를 공유합니다.
 */
export const dialog = createDialogApi(new DialogStore(), {
  confirm: { component: Confirm, mode: 'async' },
});
