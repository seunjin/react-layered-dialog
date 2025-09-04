import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { routeConfig } from '@/router';

const NavLink = ({ path, label }: { path: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className="w-full justify-start"
      asChild
    >
      <Link to={path}>{label}</Link>
    </Button>
  );
};

export const MobileNav = () => {
  return (
    <ScrollArea className="h-full px-4 py-2">
      <nav className="flex flex-col gap-4">
        {routeConfig.map((section) => (
          <div key={section.path}>
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
              {section.path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h4>
            <div className="flex flex-col gap-1">
              {section.children.map((item) => (
                <NavLink key={item.path} path={`/${section.path}/${item.path}`} label={item.name} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
};
