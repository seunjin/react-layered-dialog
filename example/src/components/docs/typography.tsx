import { cn } from '@/lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

export function TypographyH1({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-slate-900 dark:text-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function TypographyP({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('leading-relaxed text-slate-700 dark:text-slate-300', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyBlockquote({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn('border-l-2 pl-6 italic text-slate-600 dark:text-slate-400', className)}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function TypographyList({ items, className, ...props }: { items: ReactNode[] } & HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn('ml-6 list-disc text-slate-700 dark:text-slate-300', className)} {...props}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function TypographyLead({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-xl text-slate-600 dark:text-slate-400', className)}
      {...props}
    >
      {children}
    </p>
  );
}
