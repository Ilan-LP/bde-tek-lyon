import { ResourceList } from '../../components/admin/ResourceList';
import type { AdminClub } from '../../lib/types';

export function AdminClubsPage() {
  return (
    <ResourceList<AdminClub>
      title="Clubs"
      endpoint="/api/admin/clubs"
      basePath="/admin/clubs"
      newLabel="Nouveau club"
      emptyText="Aucun club pour le moment. Crée le premier !"
      itemLabel={(club) => club.name}
      columns={[
        { header: 'Nom', cell: (club) => club.name },
        { header: 'Contact', cell: (club) => club.contactEmail ?? '—' },
      ]}
    />
  );
}
