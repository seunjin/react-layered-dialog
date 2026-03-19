import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu, Check, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import GithubIcon from '@/assets/github.svg?react';
import { ThemeToggle } from '../ThemeToggle';

const CopyLlmButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}llms.txt`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 권한 없거나 fetch 실패 시 무시
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : 'Copy for LLM'}
    </Button>
  );
};

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
      <CopyLlmButton />
      <a
        href="https://github.com/seunjin/react-layered-dialog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon">
          <GithubIcon className="h-5 w-5 fill-current" />
        </Button>
      </a>
      <ThemeToggle />
    </div>
  </header>
);
