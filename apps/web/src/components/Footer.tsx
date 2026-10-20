import { Link } from 'react-router';
import { site } from '../content/site';
import { config } from '../lib/config';
import { navLinks } from './navigation';

export function Footer() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl px-4 pb-10 md:px-8">
      <div className="border-wave-blue/40 flex flex-col gap-8 border-t-4 pt-8 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-wave-blue text-3xl tracking-normal">{site.name}</p>
          <p className="mt-1">
            {site.tagline} · {site.season}
          </p>
          {config.clubEmail && (
            <p className="mt-3">
              <a href={`mailto:${config.clubEmail}`} className="text-wave-blue underline">
                {config.clubEmail}
              </a>
            </p>
          )}
        </div>

        <nav aria-label="Navigation du pied de page">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-wave-blue">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/mentions-legales" className="hover:text-wave-blue">
                Mentions légales
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="text-wave-gray mt-8">
        © {site.season} {site.name} – {site.school}
      </p>
    </footer>
  );
}
