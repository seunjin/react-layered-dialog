import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';

export const AdvancedFeaturesDemo = () => {
  const { openDialog, closeAllDialogs, closeDialog } = useDialogs();

  const openNestedModal = () =>
    openDialog('modal', {
      title: '중첩된 다이얼로그',
      description: '이 다이얼로그는 제어판 위로 열린 예시입니다.',
      body: (
        <>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              여기에서 또 다른 다이얼로그를 열어 스택 동작을 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => closeDialog()}>
              이 다이얼로그 닫기
            </Button>
            <Button variant="outline" onClick={closeAllDialogs}>
              모든 다이얼로그 닫기
            </Button>
          </div>
        </>
      ),
    });

  const handleOpenControlPanel = () =>
    openDialog('modal', {
      title: '고급 제어판',
      description: '다른 다이얼로그를 열어 중첩시키는 컨트롤 패널입니다.',
      body: (
        <>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              필요한 만큼 중첩해서 열어도 각 다이얼로그가 독립적으로 관리됩니다.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={openNestedModal}>중첩 모달 열기</Button>
            <Button variant="outline" onClick={() => closeDialog()}>
              제어판 닫기
            </Button>
          </div>
        </>
      ),
    });

  return <Button onClick={handleOpenControlPanel}>고급 제어판 열기</Button>;
};
