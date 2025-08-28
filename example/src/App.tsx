import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';

// 페이지 컴포넌트 임포트
import { Introduction } from '@/pages/Introduction';
import { Examples } from '@/pages/Examples';

// --- 레이아웃 컴포넌트 ---

const Header = () => (
  <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
    <h1 className="text-xl font-bold tracking-tight">React Layered Dialog</h1>
    <a
      href="https://github.com/seunjin/react-layered-dialog"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="outline" size="icon">
        <Github className="h-4 w-4" />
      </Button>
    </a>
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
    { id: 'intro', label: '소개 및 설치법' },
    { id: 'examples', label: '사용 예제' },
  ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-muted/40 p-4 md:flex">
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

// --- 메인 앱 ---

function App() {
  const { dialogs } = useDialogs();
  const [currentView, setCurrentView] = useState('intro');

  useEffect(() => {
    console.log(
      '%c[React Layered Dialog] %cState Changed:',
      'color: #7c3aed; font-weight: bold;',
      'color: inherit;',
      dialogs
    );
  }, [dialogs]);

  const renderContent = () => {
    switch (currentView) {
      case 'examples':
        return <Examples />;
      case 'intro':
      default:
        return <Introduction />;
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col">
      <Header />
      <div className="flex flex-1 ">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <DialogRenderer />
    </div>
  );
}

export default App;
