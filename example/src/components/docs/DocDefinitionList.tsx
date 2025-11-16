import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function DocDefinitionList({
  items,
  className,
}: {
  items: Array<{ term: ReactNode; detail: ReactNode }>;
  className?: string;
}) {
  return (
    <dl className={cn('not-prose grid grid-cols-1 gap-y-2 sm:grid-cols-4', className)}>
      {items.map((it, idx) => (
        <div key={idx} className="contents">
          <dt className="sm:col-span-1 text-xs font-semibold text-muted-foreground mt-1">
            {it.term}
          </dt>
          <dd className="sm:col-span-3 text-sm leading-relaxed">{it.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

