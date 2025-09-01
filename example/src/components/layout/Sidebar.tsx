import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TypographyH4 } from '@/components/ui/typography';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [{ path: '/', label: '소개 및 설치법' }];

  const exampleMenuItems = [
    { path: '/examples/basic', label: '기본 다이얼로그' },
    { path: '/examples/custom', label: '커스텀 다이얼로그' },
    { path: '/examples/setup', label: '핵심 파일 설정' },
    { path: '/examples/renderer', label: '렌더링 레이어' },
  ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <nav className="flex flex-col gap-2">
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

        <div className="mt-4">
          <TypographyH4 className="mb-2 px-4">사용 예제</TypographyH4>
          <div className="flex flex-col gap-1">
            {exampleMenuItems.map((item) => (
              <Button
                key={item.path}
                variant={
                  location.pathname === item.path ? 'secondary' : 'ghost'
                }
                className="w-full justify-start pl-6"
                asChild
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};
