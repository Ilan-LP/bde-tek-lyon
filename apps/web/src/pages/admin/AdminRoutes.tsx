import { Route, Routes } from 'react-router';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminRoot } from '../../components/admin/AdminRoot';
import { RequireAdmin } from '../../components/admin/RequireAdmin';
import { AdminClubFormPage } from './AdminClubFormPage';
import { AdminClubsPage } from './AdminClubsPage';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminEventFormPage } from './AdminEventFormPage';
import { AdminEventsPage } from './AdminEventsPage';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminNotFoundPage } from './AdminNotFoundPage';
import { AdminPartnerFormPage } from './AdminPartnerFormPage';
import { AdminPartnersPage } from './AdminPartnersPage';
import { AdminUsersPage } from './AdminUsersPage';

// Everything under /admin. Loaded lazily by App.tsx, so visitors of the public site never
// download the admin code. Paths are relative to /admin.
export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminRoot />}>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="evenements" element={<AdminEventsPage />} />
            <Route path="evenements/nouveau" element={<AdminEventFormPage />} />
            <Route path="evenements/:id" element={<AdminEventFormPage />} />
            <Route path="clubs" element={<AdminClubsPage />} />
            <Route path="clubs/nouveau" element={<AdminClubFormPage />} />
            <Route path="clubs/:id" element={<AdminClubFormPage />} />
            <Route path="partenaires" element={<AdminPartnersPage />} />
            <Route path="partenaires/nouveau" element={<AdminPartnerFormPage />} />
            <Route path="partenaires/:id" element={<AdminPartnerFormPage />} />
            <Route path="admins" element={<AdminUsersPage />} />
            <Route path="*" element={<AdminNotFoundPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
