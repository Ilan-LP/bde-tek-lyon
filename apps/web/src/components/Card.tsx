import type { ReactNode } from 'react';

// Brand card: Main Blue outline (4px), soft rounded corners, translucent Off-White fill.
// `interactive` adds a hover tint for cards that are entirely clickable.
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
        'relative overflow-hidden rounded-3xl border-4 border-wave-blue bg-wave-offwhite/60',
        'backdrop-blur-sm transition-colors motion-reduce:transition-none',
        interactive ? 'hover:bg-wave-sky/40' : '',
        className,
      ].join(' ')}
    >
      {children}
    </article>
  );
}
