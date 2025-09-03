import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const menuConfig = [
  {
    title: 'Getting Started',
    items: [
      { path: '/getting-started/introduction', label: 'Introduction' },
      { path: '/getting-started/quick-start', label: 'Quick Start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { path: '/core-concepts/how-it-works', label: 'How it Works' },
      { path: '/core-concepts/creating-a-dialog', label: 'Creating a Dialog' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { path: '/guides/opening-and-closing', label: 'Open/Close Dialog' },
      { path: '/guides/nested-dialogs', label: 'Nested Dialogs' },
      { path: '/guides/state-management', label: 'Update Dialog State' },
      { path: '/guides/animations', label: 'Animations' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { path: '/advanced/accessibility', label: 'Accessibility' },
      { path: '/advanced/custom-overlay', label: 'Custom Overlay / Portal' },
      { path: '/advanced/typescript-recipes', label: 'TypeScript Recipes' },
    ],
  },
  {
    title: 'Examples',
    items: [
      { path: '/examples/live-demos', label: 'Live Demos' },
      { path: '/examples/alert-dialog', label: 'Alert Dialog' },
      { path: '/examples/confirm-dialog', label: 'Confirm Dialog' },
      { path: '/examples/drawer', label: 'Drawer / Bottom Sheet' },
      { path: '/examples/context-menu', label: 'Context Menu' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { path: '/api/functions-and-hooks', label: 'Functions & Hooks' },
    ],
  },
  {
    title: 'FAQ',
    items: [
      { path: '/faq/troubleshooting', label: 'Troubleshooting' },
    ],
  },
];

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

export const Sidebar = () => {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-muted/40 md:flex">
      <ScrollArea className="flex-1 px-4 py-2">
        <nav className="flex flex-col gap-4">
          {menuConfig.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                {section.title}
              </h4>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <NavLink key={item.path} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};