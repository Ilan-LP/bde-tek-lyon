import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../assets/wave_logo_blue.png';
import { site } from '../content/site';
import { Button } from './Button';
import { navLinks } from './navigation';

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'font-label tracking-wave inline-flex min-h-11 whitespace-nowrap items-center px-3 text-xl transition-colors',
    'motion-reduce:transition-none',
    isActive ? 'text-wave-blue' : 'text-wave-navy/80 hover:text-wave-blue',
  ].join(' ');

// Sticky header: translucent Off-White with blur and a thin Sky Blue border. One logo only.
export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="bg-wave-offwhite/85 border-wave-sky sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link to="/" onClick={close} aria-label={`${site.name}, accueil`} className="rounded-lg">
          <img src={logo} alt="" className="h-10 w-auto" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button to="/evenements" size="sm" className="whitespace-nowrap">
              Nos événements
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="text-wave-blue hover:bg-wave-blue/10 -mr-2 flex h-11 w-11 items-center justify-center rounded-xl lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navigation principale"
          className="border-wave-sky bg-wave-offwhite border-t lg:hidden"
        >
          <div className="container-site flex flex-col gap-1 py-4">
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
            <div className="mt-3 sm:hidden">
              <Button to="/evenements" onClick={close} className="w-full">
                Nos événements
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
