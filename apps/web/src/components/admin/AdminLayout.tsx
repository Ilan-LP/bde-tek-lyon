import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import logo from '../../assets/wave_logo_blue.png';
import { errorMessage } from '../../lib/api';
import { useAdminSession, useAuth } from '../../lib/auth';
import { Button } from '../Button';
import { Card } from '../Card';
import { Alert } from './Alert';

const sections = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/evenements', label: 'Événements' },
  { to: '/admin/clubs', label: 'Clubs' },
  { to: '/admin/partenaires', label: 'Partenaires' },
  { to: '/admin/admins', label: 'Admins' },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-full px-4 py-1 text-2xl transition-colors hover:bg-wave-sky/50',
    isActive ? 'bg-wave-sky/80 text-wave-blue' : 'text-wave-navy',
  ].join(' ');

// Frame of the admin pages: sidebar (sections, link to the site, logout) and the page itself.
// On a phone the sidebar sits above the page.
export function AdminLayout() {
  const admin = useAdminSession();
  const { logout } = useAuth();
  const [logoutError, setLogoutError] = useState<string>();

  async function onLogout() {
    try {
      await logout(); // the route guard then sends us to the login page
    } catch (error) {
      setLogoutError(errorMessage(error));
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row md:items-start md:gap-10 md:px-8 md:py-10">
      <aside className="md:sticky md:top-6 md:w-72 md:shrink-0">
        <Card className="flex flex-col gap-5 p-5">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="Logo BDE Wave" className="drop-shadow-logo h-14 w-auto" />
            <span className="font-display text-wave-blue text-2xl leading-tight tracking-normal">
              Administration
            </span>
          </Link>

          <nav aria-label="Administration" className="flex flex-wrap gap-1 md:flex-col">
            {sections.map((section) => (
              <NavLink key={section.to} to={section.to} end={section.end} className={linkClasses}>
                {section.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-wave-blue/30 flex flex-wrap items-center gap-3 border-t-2 pt-4 md:flex-col md:items-start">
            <p className="w-full text-lg [overflow-wrap:anywhere]">Connecté : {admin.email}</p>
            <Button size="sm" href="/">
              Voir le site
            </Button>
            <Button size="sm" onClick={() => void onLogout()}>
              Se déconnecter
            </Button>
            {logoutError && <Alert tone="error">{logoutError}</Alert>}
          </div>
        </Card>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
