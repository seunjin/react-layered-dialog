import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';

// --- 메인 앱 ---

function App() {
  const { dialogs, openDialog, closeDialog, closeAllDialogs } = useDialogs();

  // --- 데모용 컴포넌트 ---

  // 실시간 상태 뷰어
  const DialogStateViewer = () => (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>실시간 상태 뷰어</CardTitle>
        <CardDescription>
          현재 DialogManager가 관리하고 있는 다이얼로그 목록입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-sm font-mono">
          <code>{JSON.stringify(dialogs, null, 2)}</code>
        </pre>
      </CardContent>
    </Card>
  );

  // 모달 내부에 들어갈 커스텀 컨텐츠 예시
  const CustomModalContent = () => (
    <div>
      <h3 className="text-lg font-bold">커스텀 모달</h3>
      <p className="mt-2 text-sm text-gray-500">
        모달 내부에 복잡한 UI나 상호작용을 자유롭게 추가할 수 있습니다.
      </p>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" onClick={() => closeDialog()}>
          닫기
        </Button>
      </div>
    </div>
  );

  // 고급 기능 탭에서 사용할 제어용 다이얼로그 컨텐츠
  const AdvancedControlDialog = ({ layeredIds }: { layeredIds: string[] }) => {
    const handleCloseSecond = () => {
      if (layeredIds.length > 1) {
        closeDialog(layeredIds[1]);
      }
    };

    return (
      <div>
        <h3 className="text-lg font-bold">고급 제어판</h3>
        <p className="mt-2 text-sm text-gray-500">
          이 다이얼로그 안에서 다른 다이얼로그들을 제어할 수 있습니다.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button variant="outline" onClick={() => closeDialog()}>
            이 다이얼로그만 닫기
          </Button>
          <Button variant="outline" onClick={handleCloseSecond}>
            중간 다이얼로그 닫기
          </Button>
          <Button variant="outline" onClick={closeAllDialogs}>
            전체 닫기
          </Button>
        </div>
      </div>
    );
  };

  // 비동기 처리 탭에서 사용할 Confirm 모달 컨텐츠
  const AsyncConfirmContent = () => {
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = () => {
      setIsPending(true);

      setTimeout(() => {
        closeDialog();
        openDialog('alert', {
          title: '성공',
          message: '항목이 성공적으로 삭제되었습니다.',
        });
      }, 1500);
    };

    return (
      <div>
        <h3 className="text-lg font-bold">삭제 확인</h3>
        <p className="mt-2 text-sm text-gray-500">
          정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => closeDialog()}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? '삭제 중...' : '확인'}
          </Button>
        </div>
      </div>
    );
  };

  // --- 핸들러 함수 ---

  const handleLayeredOpen = () => {
    const id1 = openDialog('modal', { children: <p>첫 번째 다이얼로그</p> });
    const id2 = openDialog('modal', { children: <p>두 번째 다이얼로그</p> });
    openDialog('modal', {
      children: <AdvancedControlDialog layeredIds={[id1, id2]} />,
    });
  };

  const handleAsyncDelete = () => {
    openDialog('modal', {
      children: <AsyncConfirmContent />,
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          React Layered Dialog
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          A flexible and powerful dialog management library for React.
        </p>
      </header>

      <main>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">기본 사용법</TabsTrigger>
            <TabsTrigger value="advanced">고급 기능</TabsTrigger>
            <TabsTrigger value="async">비동기 처리</TabsTrigger>
          </TabsList>

          {/* --- 탭 컨텐츠 --- */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>기본 사용법</CardTitle>
                <CardDescription>
                  가장 일반적인 다이얼로그 타입들을 여는 예제입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
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
                  variant="secondary"
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
                <Button
                  variant="outline"
                  onClick={() =>
                    openDialog('modal', { children: <CustomModalContent /> })
                  }
                >
                  Modal 열기
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>고급 기능</CardTitle>
                <CardDescription>
                  다이얼로그 안에서 다른 다이얼로그를 제어하는 예제입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleLayeredOpen}
                  disabled={dialogs.length > 0}
                >
                  다이얼로그 겹쳐 열기
                </Button>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  버튼을 눌러 제어판이 포함된 다이얼로그를 열어보세요.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="async">
            <Card>
              <CardHeader>
                <CardTitle>비동기 처리</CardTitle>
                <CardDescription>
                  API 요청과 같은 비동기 작업과 다이얼로그를 연동하는
                  예제입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAsyncDelete}>삭제 Confirm</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogStateViewer />
      </main>

      <DialogRenderer />
    </div>
  );
}

export default App;
