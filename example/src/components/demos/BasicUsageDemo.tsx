import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';

export const BasicUsageDemo = () => {
  const { openDialog, closeDialog } = useDialogs();
  const CustomModalContent = () => (
    <div>
      <h3 className="text-lg font-bold">커스텀 모달</h3>
      <p className="mt-2 text-sm text-gray-500">
        모달 내부에 복잡한 UI나 상호작용을 자유롭게 추가할 수 있습니다.
      </p>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={() => closeDialog()}>닫기</Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 사용법</CardTitle>
        <CardDescription>가장 일반적인 다이얼로그 타입들을 여는 예제입니다. (F12를 눌러 콘솔을 확인하세요)</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-wrap">
        <Button onClick={() => openDialog('alert', { title: '알림', message: '이것은 Alert 다이얼로그입니다.' })}>Alert 열기</Button>
        <Button onClick={() => openDialog('confirm', { title: '확인', message: '계속 진행하시겠습니까?', onConfirm: () => closeDialog() })}>Confirm 열기</Button>
        <Button onClick={() => openDialog('modal', { children: <CustomModalContent /> })}>Modal 열기</Button>
      </CardContent>
    </Card>
  );
};
