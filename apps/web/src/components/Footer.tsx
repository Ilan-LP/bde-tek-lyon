import { Link } from 'react-router';
import logo from '../assets/wave_logo_white.png';
import { site } from '../content/site';
import { config } from '../lib/config';
import { navLinks } from './navigation';

const linkClasses = 'text-wave-offwhite/85 hover:text-wave-sky inline-flex min-h-8 items-center';

export function Footer() {
  return (
    <footer className="on-dark bg-wave-navy text-wave-offwhite/85">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1fr_1fr_1.4fr]">
        <div>
          <Link to="/" aria-label={`${site.name}, accueil`} className="inline-block rounded-lg">
            <img src={logo} alt="" className="h-14 w-auto" />
          </Link>
          <p className="mt-4 max-w-[34ch]">{site.tagline}.</p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <p className="font-label tracking-wave text-wave-sky mb-3 text-xl">Navigation</p>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={linkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-label tracking-wave text-wave-sky mb-3 text-xl">Contact</p>
          <ul className="space-y-1">
            {config.clubEmail && (
              <li>
                <a href={`mailto:${config.clubEmail}`} className={`${linkClasses} break-words`}>
                  {config.clubEmail}
                </a>
              </li>
            )}
            <li>
              <Link to="/mentions-legales" className={linkClasses}>
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-wave-offwhite/15 border-t">
        <p className="container-site text-wave-gray py-6 text-sm">
          © {site.season} {site.legal.legalName} · {site.name}, {site.school}
        </p>
      </div>
    </footer>
  );
}
