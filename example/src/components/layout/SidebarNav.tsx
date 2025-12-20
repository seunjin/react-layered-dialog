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
          'text-[15px] text-start text-accent-foreground/50',
          'hover:text-accent-foreground',
          isActive && 'text-accent-foreground font-medium'
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
          title: 'Core',
          items: apiSection.children.filter((c) => core.has(c.path)),
        },
        {
          title: 'Types',
          items: apiSection.children.filter((c) => types.has(c.path)),
        },
        {
          title: 'Advanced',
          items: apiSection.children.filter((c) =>
            c.path.startsWith('advanced/')
          ),
        },
      ].filter((g) => g.items.length > 0);

    return (
      <div key={apiSection.path}>
        <h4 className="mb-4 text-[15px] font-bold text-foreground border-b-2 pb-1.5 border-muted-foreground/10">
          {apiSection.title}
        </h4>
        <div className="flex flex-col gap-3">
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-1">
              <div className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
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
            <h4 className="mb-4 text-[15px] font-bold text-foreground border-b-2 pb-1.5 border-muted-foreground/10">
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
