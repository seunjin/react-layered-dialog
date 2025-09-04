// components/docs/DocArticle.tsx
import * as React from 'react';

export function DocArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-pre:bg-transparent prose-pre:p-0 dark:prose-invert mx-auto w-full max-w-[var(--prose-max)] flex-1">
      {children}
    </article>
  );
}
