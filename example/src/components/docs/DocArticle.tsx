// components/docs/DocArticle.tsx
import * as React from 'react';

export function DocArticle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      aria-labelledby="page-title"
      className="prose prose-pre:bg-transparent prose-pre:p-0 dark:prose-invert flex-1"
    >
      <h1 id="page-title">{title}</h1>
      {children}
    </article>
  );
}
