import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/Button';

export function AdminNotFoundPage() {
  return (
    <div>
      <AdminPageHeader title="Page introuvable" />
      <p className="mb-6 text-2xl">Cette page d’administration n’existe pas.</p>
      <Button to="/admin">Retour au tableau de bord</Button>
    </div>
  );
}
