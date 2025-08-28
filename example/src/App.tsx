import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';

// 페이지 컴포넌트 임포트
import { Introduction } from '@/pages/Introduction';
import { BasicDialogs } from '@/pages/examples/BasicDialogs';
import { CustomDialog } from '@/pages/examples/CustomDialog';
import { CoreSetup } from '@/pages/examples/CoreSetup';
import { RenderingLayer } from '@/pages/examples/RenderingLayer';

// --- 레이아웃 컴포넌트 ---

const Header = () => (
  <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
    <h1 className="text-xl font-bold tracking-tight">React Layered Dialog</h1>
    <a href="https://github.com/seunjin/react-layered-dialog" target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="icon">
        <Github className="h-4 w-4" />
      </Button>
    </a>
  </header>
);

const Sidebar = () => {
  const location = useLocation();
  const [isExamplesOpen, setIsExamplesOpen] = useState(
    location.pathname.startsWith('/examples')
  );

  const menuItems = [
    { path: '/', label: '소개 및 설치법' },
  ];

  const exampleMenuItems = [
    { path: '/examples/basic', label: '기본 다이얼로그' },
    { path: '/examples/custom', label: '커스텀 다이얼로그' },
    { path: '/examples/setup', label: '핵심 파일 설정' },
    { path: '/examples/renderer', label: '렌더링 레이어' },
  ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? 'secondary' : 'ghost'}
            className="justify-start"
            asChild
          >
            <Link to={item.path}>{item.label}</Link>
          </Button>
        ))}
        <Collapsible open={isExamplesOpen} onOpenChange={setIsExamplesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              사용 예제
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pt-1">
            {exampleMenuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                className="w-full justify-start pl-6"
                asChild
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </aside>
  );
};

// --- 메인 앱 ---

function App() {
  const { dialogs } = useDialogs();

  useEffect(() => {
    console.log(
      '%c[React Layered Dialog] %cState Changed:',
      'color: #7c3aed; font-weight: bold;',
      'color: inherit;',
      dialogs
    );
  }, [dialogs]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col">
      <Header />
      <div className="flex flex-1 ">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Introduction />} />
              <Route path="/examples/basic" element={<BasicDialogs />} />
              <Route path="/examples/custom" element={<CustomDialog />} />
              <Route path="/examples/setup" element={<CoreSetup />} />
              <Route path="/examples/renderer" element={<RenderingLayer />} />
            </Routes>
          </div>
        </main>
      </div>
      <DialogRenderer />
    </div>
  );
}

export default App;