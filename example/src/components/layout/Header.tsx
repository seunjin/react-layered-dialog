import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Github from '@/assets/github.svg';
import { ThemeToggle } from '../ThemeToggle';
export const Header = () => (
  <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4">
    <div className="flex items-center gap-2">
      <SidebarTrigger className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </SidebarTrigger>
      <Link
        to="/getting-started/introduction"
        className="text-lg font-semibold tracking-tight"
      >
        React Layered Dialog
      </Link>
    </div>
    <div className="flex items-center gap-2">
      <a
        href="https://github.com/seunjin/react-layered-dialog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon">
          <img className="h-5 w-5" src={Github} alt="" />
        </Button>
      </a>
      <ThemeToggle />
    </div>
  </header>
);
