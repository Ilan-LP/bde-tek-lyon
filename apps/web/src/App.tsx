import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { AboutPage } from './pages/AboutPage';
import { ClubsPage } from './pages/ClubsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventsPage } from './pages/EventsPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PartnersPage } from './pages/PartnersPage';

// The admin area is a separate chunk: it is only downloaded when someone opens /admin.
const AdminRoutes = lazy(() =>
  import('./pages/admin/AdminRoutes').then((module) => ({ default: module.AdminRoutes })),
);

export function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <p role="status" className="text-wave-blue py-24 text-center text-2xl">
                Chargement…
              </p>
            }
          >
            <AdminRoutes />
          </Suspense>
        }
      />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/evenements/:slug" element={<EventDetailPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/partenaires" element={<PartnersPage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
