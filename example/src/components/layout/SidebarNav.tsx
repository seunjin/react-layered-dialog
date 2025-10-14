import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { routeConfig } from '@/router';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';

const NavLink = ({ path, label }: { path: string; label: string }) => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const isActive = location.pathname === path;

  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className="w-full justify-start"
      asChild
      onClick={() => setOpenMobile(false)}
    >
      <Link to={path}>{label}</Link>
    </Button>
  );
};

export const SidebarNav = ({ className }: { className?: string }) => {
  return (
    <nav className={cn('flex flex-col gap-4', className)}>
      {routeConfig.map((section) => (
        <div key={section.path}>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
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
      ))}
    </nav>
  );
};
