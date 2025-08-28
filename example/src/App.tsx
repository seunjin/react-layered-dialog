import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Loader2, Github } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';

// --- 레이아웃 컴포넌트 ---

const Header = () => (
  <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
    <h1 className="text-xl font-bold tracking-tight">React Layered Dialog</h1>
    <div className="flex items-center gap-2">
      <a href="https://github.com/seunjin/react-layered-dialog" target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon">
          <Github className="h-4 w-4" />
        </Button>
      </a>
      <DialogStateViewer />
    </div>
  </header>
);

const Sidebar = ({
  currentView,
  setCurrentView,
}: {
  currentView: string;
  setCurrentView: (view: string) => void;
}) => {
  const menuItems = [
    { id: 'basic', label: '기본 사용법' },
    { id: 'advanced', label: '고급 기능' },
    { id: 'async', label: '비동기 처리' },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'secondary' : 'ghost'}
            className="justify-start"
            onClick={() => setCurrentView(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

const DialogStateViewer = () => {
  const { dialogs } = useDialogs();
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="outline">실시간 상태 보기</Button>
      </SheetTrigger>
      <SheetContent
        className="w-full max-w-lg p-0"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <SheetHeader className="p-6">
          <SheetTitle>실시간 상태 뷰어</SheetTitle>
          <SheetDescription>
            현재 DialogManager가 관리하고 있는 다이얼로그 목록입니다.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 pb-6 h-[calc(100vh-8rem)]">
          <pre className="h-full overflow-auto rounded-md bg-gray-900 p-4 text-sm font-mono text-white">
            <code>{JSON.stringify(dialogs, null, 2)}</code>
          </pre>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// --- 데모 컨텐츠 컴포넌트 ---

const BasicUsageDemo = () => {
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
        <CardDescription>가장 일반적인 다이얼로그 타입들을 여는 예제입니다.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-wrap">
        <Button onClick={() => openDialog('alert', { title: '알림', message: '이것은 Alert 다이얼로그입니다.' })}>Alert 열기</Button>
        <Button onClick={() => openDialog('confirm', { title: '확인', message: '계속 진행하시겠습니까?', onConfirm: () => closeDialog() })}>Confirm 열기</Button>
        <Button onClick={() => openDialog('modal', { children: <CustomModalContent /> })}>Modal 열기</Button>
      </CardContent>
    </Card>
  );
};

const AdvancedFeaturesDemo = () => {
  const { dialogs, openDialog, closeAllDialogs, closeDialog } = useDialogs();
  const NestedDialogContent = () => {
    const handleOpenNested = () => openDialog('modal', { children: <NestedDialogContent /> });
    return (
      <div>
        <h3 className="text-lg font-bold">중첩된 다이얼로그</h3>
        <p className="mt-2 text-sm text-gray-500">이 다이얼로그는 제어판 위로 열렸습니다.</p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={handleOpenNested}>중첩 모달 열기</Button>
          <Button variant="outline" onClick={() => closeDialog()}>이 다이얼로그만 닫기</Button>
          <Button variant="outline" onClick={closeAllDialogs}>모든 다이얼로그 닫기</Button>
        </div>
      </div>
    );
  };
  const AdvancedControlDialog = () => {
    const handleOpenNested = () => openDialog('modal', { children: <NestedDialogContent /> });
    return (
      <div>
        <h3 className="text-lg font-bold">고급 제어판</h3>
        <p className="mt-2 text-sm text-gray-500">여기서 다른 다이얼로그를 열어 중첩시킬 수 있습니다.</p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={handleOpenNested}>중첩 모달 열기</Button>
          <Button variant="outline" onClick={() => closeDialog()}>제어판 닫기</Button>
        </div>
      </div>
    );
  };
  const handleLayeredOpen = () => openDialog('modal', { children: <AdvancedControlDialog /> });

  return (
    <Card>
      <CardHeader>
        <CardTitle>고급 기능</CardTitle>
        <CardDescription>다이얼로그 안에서 다른 다이얼로그를 제어하는 예제입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleLayeredOpen} disabled={dialogs.length > 0}>고급 제어판 열기</Button>
      </CardContent>
    </Card>
  );
};

const AsyncHandlingDemo = () => {
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
    <Card>
      <CardHeader>
        <CardTitle>비동기 처리</CardTitle>
        <CardDescription>API 요청과 같은 비동기 작업과 다이얼로그를 연동하는 예제입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAsyncDelete}>삭제 Confirm</Button>
      </CardContent>
    </Card>
  );
};

// --- 메인 앱 ---

function App() {
  const [currentView, setCurrentView] = useState('basic');

  const renderContent = () => {
    switch (currentView) {
      case 'advanced':
        return <AdvancedFeaturesDemo />;
      case 'async':
        return <AsyncHandlingDemo />;
      case 'basic':
      default:
        return <BasicUsageDemo />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
      <DialogRenderer />
    </div>
  );
}

export default App;
