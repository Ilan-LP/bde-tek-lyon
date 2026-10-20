import type { ReactNode } from 'react';
import { Link } from 'react-router';

type ButtonProps = {
  children: ReactNode;
  /** Internal route: renders a router Link. */
  to?: string;
  /** External link or mailto:. Opens in a new tab unless it is a mailto:. */
  href?: string;
  onClick?: () => void;
  /** Real button only: "submit" sends the surrounding form. */
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** For toggle buttons: filled when selected, outlined otherwise (overrides `variant`). */
  pressed?: boolean;
  /**
   * primary: filled Main Blue. secondary: Main Blue outline.
   * light / ghost: for dark backgrounds (filled Off-White / Off-White outline).
   */
  variant?: 'primary' | 'secondary' | 'light' | 'ghost';
  size?: 'md' | 'sm';
  className?: string;
};

const variants = {
  primary: 'bg-wave-blue text-wave-offwhite hover:bg-wave-blue-dark',
  secondary: 'border-[1.5px] border-wave-blue text-wave-blue hover:bg-wave-blue/10',
  light: 'bg-wave-offwhite text-wave-navy hover:bg-wave-sky',
  ghost: 'border-[1.5px] border-wave-offwhite/70 text-wave-offwhite hover:bg-wave-offwhite/10',
};

export function Button({
  children,
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  pressed,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) {
  const style = pressed === undefined ? variant : pressed ? 'primary' : 'secondary';
  const classes = [
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-button font-label tracking-wave',
    'transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50',
    size === 'md' ? 'px-6 text-xl' : 'px-4 text-lg',
    variants[style],
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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={classes}
    >
      {children}
    </button>
  );
}
