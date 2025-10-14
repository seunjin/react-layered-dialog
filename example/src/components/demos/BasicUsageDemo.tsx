import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';

export const BasicUsageDemo = () => {
  const { openDialog, closeDialog } = useDialogs();

  const handleOpenModal = () =>
    openDialog('modal', {
      title: '커스텀 모달',
      description: '모달 내부에 원하는 UI를 자유롭게 배치할 수 있습니다.',
      body: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>버튼, 폼, 리스트 등 어떤 컴포넌트든 이 영역에 렌더링할 수 있습니다.</p>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => closeDialog()}>
              닫기
            </Button>
          </div>
        </div>
      ),
    });

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          openDialog('alert', {
            title: '알림',
            message: '이것은 Alert 다이얼로그입니다.',
          })
        }
      >
        Alert 열기
      </Button>
      <Button
        onClick={() =>
          openDialog('confirm', {
            title: '확인',
            message: '계속 진행하시겠습니까?',
            onConfirm: () => closeDialog(),
          })
        }
      >
        Confirm 열기
      </Button>
      <Button onClick={handleOpenModal}>Modal 열기</Button>
    </div>
  );
};
