import { Link, useLocation } from 'react-router-dom';
import { routeConfig } from '@/router';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';

const NavLink = ({ path, label }: { path: string; label: string }) => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const isActive = location.pathname === path;

  return (
    <button
      className="w-full text-start px-2"
      onClick={() => setOpenMobile(false)}
    >
      <Link
        className={cn(
          'text-sm text-start text-accent-foreground/50',
          'hover:text-accent-foreground',
          isActive && 'text-accent-foreground'
        )}
        to={path}
      >
        - {label}
      </Link>
    </button>
  );
};

export const SidebarNav = ({ className }: { className?: string }) => {
  const renderApiGrouped = () => {
    const apiSection = routeConfig.find((s) => s.path === 'api');
    if (!apiSection) return null;

    const core = new Set([
      'dialog-store',
      'create-dialog-api',
      'define-dialog',
      'dialogs-renderer',
      'use-dialog-controller',
    ]);
    const types = new Set(['types']);

    const groups: Array<{ title: string; items: typeof apiSection.children }> =
      [
        {
          title: '코어',
          items: apiSection.children.filter((c) => core.has(c.path)),
        },
        {
          title: '타입',
          items: apiSection.children.filter((c) => types.has(c.path)),
        },
        {
          title: '고급',
          items: apiSection.children.filter((c) =>
            c.path.startsWith('advanced/')
          ),
        },
        {
          title: '부록',
          items: apiSection.children.filter((c) =>
            c.path.startsWith('appendix/')
          ),
        },
      ].filter((g) => g.items.length > 0);

    return (
      <div key={apiSection.path}>
        <h4 className="mb-2 text-sm font-semibold text-foreground border-b-1 pb-1 border-muted-foreground/20">
          {apiSection.title}
        </h4>
        <div className="flex flex-col gap-3">
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-muted-foreground">
                {g.title}
              </div>
              {g.items.map((item) => (
                <NavLink
                  key={item.path}
                  path={`/${apiSection.path}/${item.path}`}
                  label={item.name}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className={cn('flex flex-col gap-4', className)}>
      {routeConfig.map((section) => {
        if (section.path === 'api') return renderApiGrouped();
        return (
          <div key={section.path}>
            <h4 className="mb-2 text-sm font-semibold text-foreground border-b-1 pb-1 border-muted-foreground/20">
              {section.title}
            </h4>
            <div className="flex flex-col gap-1">
              {section.children.map((item) => (
                <NavLink
                  key={item.path}
                  path={`/${section.path}/${item.path}`}
                  label={item.name}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
};
