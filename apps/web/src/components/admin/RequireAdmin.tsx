import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../lib/auth';
import { Button } from '../Button';
import { Card } from '../Card';

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-10">
      <Card className="w-full p-8 text-center text-2xl">{children}</Card>
    </div>
  );
}

// Route guard: renders the admin pages only for a logged-in admin (checked with GET /api/auth/me),
// otherwise sends the visitor to the login page and brings them back afterwards.
export function RequireAdmin() {
  const { state, retry } = useAuth();
  const location = useLocation();

  if (state.status === 'loading') {
    return (
      <CenteredMessage>
        <p role="status" className="text-wave-blue motion-safe:animate-pulse">
          Chargement…
        </p>
      </CenteredMessage>
    );
  }
  if (state.status === 'error') {
    return (
      <CenteredMessage>
        <div role="alert">
          <p>Impossible de joindre le serveur. Vérifie ta connexion et réessaie.</p>
          <Button size="sm" onClick={retry} className="mt-5">
            Réessayer
          </Button>
        </div>
      </CenteredMessage>
    );
  }
  if (state.status === 'anonymous') {
    // After an expired session, come back to this page once logged in again.
    // After an explicit logout, the next login starts from the dashboard.
    const from = state.loggedOut ? undefined : location.pathname;
    return <Navigate to="/admin/login" replace state={{ from }} />;
  }
  return <Outlet />;
}
