import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';

export const Sidebar = () => {
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
