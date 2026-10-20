import type { ReactNode } from 'react';

// A page section with the site rhythm: generous vertical padding and a 1120px container.
// Backgrounds alternate: Off-White ("light"), then a very light Sky Blue tint ("tint").
// `blob` adds one subtle blurred Sky Blue shape in a corner, away from the text.
export function Section({
  children,
  tone = 'light',
  blob = false,
  className = '',
  id,
  labelledBy,
}: {
  children: ReactNode;
  tone?: 'light' | 'tint';
  blob?: boolean;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={[
        'section-y relative overflow-hidden',
        tone === 'tint' ? 'bg-wave-tint' : 'bg-wave-offwhite',
      ].join(' ')}
    >
      {blob && (
        <div
          aria-hidden="true"
          className="bg-wave-sky/70 pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-[70px]"
        />
      )}
      <div className={['container-site relative', className].join(' ')}>{children}</div>
    </section>
  );
}
