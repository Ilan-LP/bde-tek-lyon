import type { ReactNode } from 'react';

// Message banner. "error" uses the pink accent, "success" the green one (both from the palette).
export function Alert({
  tone,
  children,
  className = '',
}: {
  tone: 'error' | 'success';
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={[
        'text-wave-navy rounded-2xl px-4 py-3 text-xl',
        tone === 'error' ? 'bg-wave-pink' : 'bg-wave-green/70',
        className,
      ].join(' ')}
    >
      {children}
    </p>
  );
}
