import type { ReactNode } from 'react';

type SectionProps = {
  as?: 'h2' | 'h3' | 'h4';
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  as = 'h2',
  id,
  title,
  children,
  className,
}: SectionProps) {
  const H = as;
  return (
    <section aria-labelledby={id} className={className}>
      <H id={id}>{title}</H>
      {children}
    </section>
  );
}
