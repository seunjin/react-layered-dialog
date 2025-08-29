import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export const Header = () => (
  <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
    <h1 className="text-xl font-bold tracking-tight">React Layered Dialog</h1>
    <a href="https://github.com/seunjin/react-layered-dialog" target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="icon">
        <Github className="h-4 w-4" />
      </Button>
    </a>
  </header>
);