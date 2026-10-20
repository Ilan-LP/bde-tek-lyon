import { ResourceList } from '../../components/admin/ResourceList';
import { formatEventWhen } from '../../lib/format';
import type { AdminEvent } from '../../lib/types';

export function AdminEventsPage() {
  return (
    <ResourceList<AdminEvent>
      title="Événements"
      endpoint="/api/admin/events"
      basePath="/admin/evenements"
      newLabel="Nouvel événement"
      emptyText="Aucun événement pour le moment. Crée le premier !"
      itemLabel={(event) => event.title}
      columns={[
        { header: 'Titre', cell: (event) => event.title },
        { header: 'Date', cell: (event) => formatEventWhen(event.startsAt, event.endsAt) },
        { header: 'Lieu', cell: (event) => event.location },
      ]}
    />
  );
}
