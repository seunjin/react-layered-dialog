import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';

export const PlainUsageDemo = () => {
  const { openDialog, closeDialog } = useDialogs();

  const openPlainModal = () =>
    openDialog('plain-modal', {
      title: '기본 모달',
      description: '모션을 사용하지 않는 간단한 모달 예제입니다.',
      body: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>애니메이션 없이도 충분히 사용 가능한 레이아웃을 구현할 수 있습니다.</p>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => closeDialog()}>
              닫기
            </Button>
          </div>
        </div>
      ),
      footer: <span className="text-xs text-muted-foreground">Footer 영역 예시입니다.</span>,
    });

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          openDialog('plain-alert', {
            title: 'Plain Alert',
            message: 'Framer Motion 없이 구현된 알림 예제입니다.',
          })
        }
      >
        Plain Alert
      </Button>
      <Button
        onClick={() =>
          openDialog('plain-confirm', {
            title: 'Plain Confirm',
            message: '계속 진행하시겠습니까?',
            onConfirm: () => closeDialog(),
          })
        }
      >
        Plain Confirm
      </Button>
      <Button onClick={openPlainModal}>Plain Modal</Button>
    </div>
  );
};
