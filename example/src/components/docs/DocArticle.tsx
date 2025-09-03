// components/docs/DocArticle.tsx
import * as React from "react"

export function DocArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="docs-prose text-[rgb(var(--foreground))]">
      {children}
    </article>
  )
}
