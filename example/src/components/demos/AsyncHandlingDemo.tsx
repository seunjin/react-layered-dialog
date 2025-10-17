import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useDialogs } from '@/lib/dialogs';

export const AsyncHandlingDemo = () => {
  const { openDialog, updateDialog, closeDialog } = useDialogs();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = () => {
    if (isPending) return;
    setIsPending(true);

    const handle = openDialog('confirm', {
      title: '삭제 확인',
      message: '이 항목을 삭제하시겠습니까?',
      step: 'confirm',
      onConfirm: () => {
        updateDialog(handle, {
          step: 'loading',
          message: '삭제 작업을 처리하고 있습니다...',
          onConfirm: undefined,
          onCancel: undefined,
          closeOnEscape: false,
          closeOnOutsideClick: false,
        });

        setTimeout(() => {
          updateDialog(handle, {
            step: 'done',
            message: '삭제가 완료되었습니다.',
            onConfirm: () => {
              closeDialog(handle.id);
              setIsPending(false);
              return false;
            },
            onCancel: undefined,
            closeOnEscape: true,
            closeOnOutsideClick: true,
          });
        }, 1200);
        return false;
      },
      onCancel: () => {
        closeDialog(handle.id);
        setIsPending(false);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit" onClick={handleDelete} disabled={isPending}>
        삭제 흐름 실행
      </Button>
      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        <p className="mb-1 font-medium">updateDialog 활용 예시</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            동일한 다이얼로그를 닫지 않고 <code>message</code>와{' '}
            <code>step</code>만 덮어씁니다.
          </li>
          <li>
            <code>updateDialog(handle, patch)</code> 호출은 필요한 필드만
            갱신하며 나머지는 유지됩니다.
          </li>
          <li>실제 환경에서는 에러/취소 처리 등을 추가로 조합해 주세요.</li>
        </ul>
      </div>
    </div>
  );
};
