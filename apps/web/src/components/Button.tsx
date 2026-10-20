import type { ReactNode } from 'react';
import { Link } from 'react-router';

type ButtonProps = {
  children: ReactNode;
  /** Internal route: renders a router Link. */
  to?: string;
  /** External link or mailto:. Opens in a new tab unless it is a mailto:. */
  href?: string;
  onClick?: () => void;
  /** For toggle buttons: shows the button as selected. */
  pressed?: boolean;
  size?: 'md' | 'sm';
  className?: string;
};

// Brand buttons: a simple Main Blue outline (4px), transparent fill, never a heavy color block.
export function Button({
  children,
  to,
  href,
  onClick,
  pressed,
  size = 'md',
  className = '',
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center rounded-full border-4 border-wave-blue',
    'text-wave-blue transition-colors motion-reduce:transition-none',
    'hover:bg-wave-sky/50',
    pressed ? 'bg-wave-sky/70' : 'bg-wave-offwhite/30',
    size === 'md' ? 'px-7 py-2 text-2xl' : 'px-5 py-1 text-xl',
    className,
  ].join(' ');

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  if (href) {
    const external = !href.startsWith('mailto:');
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-pressed={pressed} className={classes}>
      {children}
    </button>
  );
}
