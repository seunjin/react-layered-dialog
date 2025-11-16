import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DocLink({
  to,
  children,
  className,
  showArrow = true,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50',
        className
      )}
    >
      <span>{children}</span>
      {showArrow && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
    </Link>
  );
}

export function DocLinks({
  links,
  className,
}: {
  links: Array<{ to: string; label: string }>;
  className?: string;
}) {
  return (
    <ul className={cn('ml-6 list-disc space-y-2 text-sm text-muted-foreground', className)}>
      {links.map((l) => (
        <li key={l.to}>
          <DocLink to={l.to}>{l.label}</DocLink>
        </li>
      ))}
    </ul>
  );
}
