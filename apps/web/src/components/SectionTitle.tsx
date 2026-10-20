import type { ReactNode } from 'react';

// Gagalin title with an optional Bebas Neue subtitle. Use level 1 once per page.
export function SectionTitle({
  children,
  subtitle,
  level = 2,
  className = '',
}: {
  children: ReactNode;
  subtitle?: ReactNode;
  level?: 1 | 2;
  className?: string;
}) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <div className={className}>
      <Heading
        className={[
          'font-display text-wave-blue leading-tight tracking-normal',
          level === 1 ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl',
        ].join(' ')}
      >
        {children}
      </Heading>
      {subtitle && <p className="mt-3 max-w-2xl text-2xl">{subtitle}</p>}
    </div>
  );
}
