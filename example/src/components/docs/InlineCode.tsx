import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InlineCodeProps {
  children: ReactNode;
  className?: string;
}

export const InlineCode: FC<InlineCodeProps> = ({ children, className }) => {
  return (
    <code
      className={cn(
        'font-mono text-sm bg-muted rounded px-1 py-0.5 ',
        className
      )}
    >
      {children}
    </code>
  );
};
