import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAdminSession } from '../../lib/auth';
import { useApi } from '../../lib/useApi';

// "12 au total · 9 publiés", or a dash when the numbers could not be loaded.
function CountCard({ title, endpoint, to }: { title: string; endpoint: string; to: string }) {
  const result = useApi<{ published: boolean }[]>(endpoint, { admin: true });
  const items = result.data;

  let summary = '…';
  if (result.error) summary = 'Indisponible';
  else if (items) {
    const published = items.filter((item) => item.published).length;
    summary = `${items.length} au total · ${published} publié${published > 1 ? 's' : ''}`;
  }

  return (
    <Card className="flex flex-col items-start gap-4 p-6">
      <h2 className="font-display text-wave-blue text-3xl leading-tight tracking-normal">
        {title}
      </h2>
      <p className="text-2xl">{summary}</p>
      <Button size="sm" to={to} className="mt-auto">
        Gérer
      </Button>
    </Card>
  );
}

export function AdminDashboardPage() {
  const admin = useAdminSession();

  return (
    <div>
      <AdminPageHeader title="Tableau de bord" />
      <p className="mb-8 text-2xl">Bonjour {admin.email}. Que veux-tu gérer aujourd’hui ?</p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <CountCard title="Événements" endpoint="/api/admin/events" to="/admin/evenements" />
        <CountCard title="Clubs" endpoint="/api/admin/clubs" to="/admin/clubs" />
        <CountCard title="Partenaires" endpoint="/api/admin/partners" to="/admin/partenaires" />
      </div>
    </div>
  );
}
