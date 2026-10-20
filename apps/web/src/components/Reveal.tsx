import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// Fade-up when the block scrolls into view. The CSS (.reveal in index.css) only hides the block
// for visitors who accept motion, so with "reduced motion" everything is simply visible.
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Without IntersectionObserver (very old browsers) everything is visible at once.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={['reveal', visible ? 'is-visible' : '', className].join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
