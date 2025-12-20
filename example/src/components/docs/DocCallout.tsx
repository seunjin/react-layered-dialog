import type { ReactNode } from 'react';
import { Info, Lightbulb, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'info' | 'tip' | 'warning' | 'danger';

const variantStyles: Record<Variant, { icon: typeof Info; color: string; border: string; bg: string }> = {
  info: {
    icon: Info,
    color: 'text-sky-800 dark:text-sky-200',
    border: 'border-sky-300/60 dark:border-sky-800/60',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
  },
  tip: {
    icon: Lightbulb,
    color: 'text-emerald-800 dark:text-emerald-200',
    border: 'border-emerald-300/60 dark:border-emerald-800/60',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-800 dark:text-amber-200',
    border: 'border-amber-300/60 dark:border-amber-800/60',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  danger: {
    icon: AlertOctagon,
    color: 'text-red-800 dark:text-red-200',
    border: 'border-red-300/60 dark:border-red-800/60',
    bg: 'bg-red-50 dark:bg-red-950/40',
  },
};

export function DocCallout({
  variant = 'info',
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;
  return (
    <div
      role="note"
      className={cn(
        'not-prose my-3 flex gap-3 rounded-md border p-3',
        styles.bg,
        styles.border,
        styles.color,
        className
      )}
    >

      <div className="min-w-0 flex-1">
        {title ? (
          <div className="flex items-center gap-1 mb-1 text-sm font-semibold leading-none"><Icon className="h-4 w-4 shrink-0" aria-hidden /> {title}</div>
        ) : null}
        <div className="text-sm leading-relaxed text-foreground dark:text-foreground">{children}</div>
      </div>
    </div>
  );
}

