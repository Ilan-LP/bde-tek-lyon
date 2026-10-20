import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../assets/wave_logo_blue.png';
import { site } from '../content/site';
import { navLinks } from './navigation';

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'px-3 py-1 text-2xl text-wave-navy transition-colors hover:text-wave-blue',
    isActive ? 'underline decoration-wave-blue decoration-4 underline-offset-8' : '',
  ].join(' ');

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="relative z-20 mx-auto w-full max-w-6xl px-4 pt-5 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" onClick={close} className="flex items-center gap-3">
          <img
            src={logo}
            alt={`Logo ${site.name}`}
            className="drop-shadow-logo h-14 w-auto md:h-16"
          />
          <span className="font-display text-wave-blue hidden text-3xl tracking-normal sm:inline">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="border-wave-blue bg-wave-offwhite/40 flex h-12 w-12 items-center justify-center rounded-full border-4 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#145da0" strokeWidth="3">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navigation principale"
          className="border-wave-blue bg-wave-offwhite/90 mt-4 flex flex-col gap-1 rounded-3xl border-4 p-4 backdrop-blur-sm md:hidden"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={close}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
