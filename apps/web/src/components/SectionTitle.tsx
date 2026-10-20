import type { ReactNode } from 'react';

// Gagalin title (H1 or H2, sentence case), with an optional Bebas Neue eyebrow above
// and a short Inter subtitle below. Use level 1 once per page. `tone="dark"` is for dark backgrounds.
export function SectionTitle({
  children,
  eyebrow,
  subtitle,
  level = 2,
  tone = 'light',
  className = '',
}: {
  children: ReactNode;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  level?: 1 | 2;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const Heading = level === 1 ? 'h1' : 'h2';
  const dark = tone === 'dark';
  return (
    <div className={className}>
      {eyebrow && (
        <p
          className={[
            'font-label tracking-wave mb-3 text-xl',
            dark ? 'text-wave-sky' : 'text-wave-blue',
          ].join(' ')}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={[
          'font-display text-balance break-words',
          level === 1 ? 'text-h1' : 'text-h2',
          dark ? 'text-wave-offwhite' : 'text-wave-navy',
        ].join(' ')}
      >
        {children}
      </Heading>
      {subtitle && (
        <p
          className={[
            'mt-4 max-w-[65ch] text-lg',
            dark ? 'text-wave-offwhite/85' : 'text-wave-navy/85',
          ].join(' ')}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
