import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';

const AsyncConfirmBody = ({
  onCancel,
  onConfirm,
  isPending,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) => (
  <div className="space-y-4 text-sm text-muted-foreground">
    <p>정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} disabled={isPending}>
        취소
      </Button>
      <Button onClick={onConfirm} disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? '삭제 중...' : '확인'}
      </Button>
    </div>
  </div>
);

export const AsyncHandlingDemo = () => {
  const { openDialog, closeDialog } = useDialogs();

  const handleAsyncDelete = () => {
    let dialogId = '';

    const ConfirmContent = () => {
      const [isPending, setIsPending] = useState(false);

      const handleCancel = () => closeDialog(dialogId);
      const handleConfirm = () => {
        setIsPending(true);
        setTimeout(() => {
          closeDialog(dialogId);
          openDialog('alert', {
            title: '삭제 완료',
            message: '항목이 성공적으로 삭제되었습니다.',
          });
        }, 1500);
      };

      return (
        <AsyncConfirmBody
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          isPending={isPending}
        />
      );
    };

    const body = <ConfirmContent />;

    dialogId = openDialog('modal', {
      title: '삭제 확인',
      description: '삭제 후에는 복구할 수 없습니다.',
      body,
      canDismiss: false,
    });
  };

  return <Button onClick={handleAsyncDelete}>삭제 Confirm</Button>;
};
