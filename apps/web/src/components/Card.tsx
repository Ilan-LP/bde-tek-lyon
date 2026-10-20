import type { ReactNode } from 'react';

// Card: Off-White fill, 1px Sky Blue border, 16px radius, soft shadow.
// `interactive` adds a subtle lift on hover for cards that are entirely clickable.
export function Card({
  children,
  interactive = false,
  className = '',
}: {
  children: ReactNode;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <article
      className={[
        'rounded-card border-wave-sky bg-wave-offwhite shadow-card relative overflow-hidden border',
        'transition duration-200 motion-reduce:transition-none',
        interactive
          ? 'hover:shadow-card-hover motion-safe:hover:-translate-y-1 motion-reduce:hover:shadow-card-hover'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </article>
  );
}
