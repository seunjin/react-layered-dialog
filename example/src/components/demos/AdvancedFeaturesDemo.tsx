import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';

export const AdvancedFeaturesDemo = () => {
  const { openDialog, closeAllDialogs, closeDialog } = useDialogs();
  const NestedDialogContent = () => {
    const handleOpenNested = () =>
      openDialog('modal', { children: <NestedDialogContent /> });
    return (
      <div>
        <h3 className="text-lg font-bold">중첩된 다이얼로그</h3>
        <p className="mt-2 text-sm text-gray-500">
          이 다이얼로그는 제어판 위로 열렸습니다.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={handleOpenNested}>중첩 모달 열기</Button>
          <Button variant="outline" onClick={() => closeDialog()}>
            이 다이얼로그만 닫기
          </Button>
          <Button variant="outline" onClick={closeAllDialogs}>
            모든 다이얼로그 닫기
          </Button>
        </div>
      </div>
    );
  };
  const AdvancedControlDialog = () => {
    const handleOpenNested = () =>
      openDialog('modal', { children: <NestedDialogContent /> });
    return (
      <div>
        <h3 className="text-lg font-bold">고급 제어판</h3>
        <p className="mt-2 text-sm text-gray-500">
          여기서 다른 다이얼로그를 열어 중첩시킬 수 있습니다.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={handleOpenNested}>중첩 모달 열기</Button>
          <Button variant="outline" onClick={() => closeDialog()}>
            제어판 닫기
          </Button>
        </div>
      </div>
    );
  };
  const handleLayeredOpen = () =>
    openDialog('modal', { children: <AdvancedControlDialog /> });

  return <Button onClick={handleLayeredOpen}>고급 제어판 열기</Button>;
};
