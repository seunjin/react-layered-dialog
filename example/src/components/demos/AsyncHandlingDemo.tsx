import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';

export const AsyncHandlingDemo = () => {
  const { openDialog, closeDialog } = useDialogs();
  const AsyncConfirmContent = () => {
    const [isPending, setIsPending] = useState(false);
    const handleConfirm = () => {
      setIsPending(true);
      setTimeout(() => {
        closeDialog(); // Confirm 모달을 닫고
        openDialog('alert', { title: '성공', message: '항목이 성공적으로 삭제되었습니다.' });
      }, 1500);
    };
    return (
      <div>
        <h3 className="text-lg font-bold">삭제 확인</h3>
        <p className="mt-2 text-sm text-gray-500">정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => closeDialog()} disabled={isPending}>취소</Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? '삭제 중...' : '확인'}
          </Button>
        </div>
      </div>
    );
  };
  const handleAsyncDelete = () => openDialog('modal', { children: <AsyncConfirmContent />, dismissable: false });

  return (
    <Button onClick={handleAsyncDelete}>삭제 Confirm</Button>
  );
};
