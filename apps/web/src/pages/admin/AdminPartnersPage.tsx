import { ResourceList } from '../../components/admin/ResourceList';
import type { AdminPartner } from '../../lib/types';

export function AdminPartnersPage() {
  return (
    <ResourceList<AdminPartner>
      title="Partenaires"
      endpoint="/api/admin/partners"
      basePath="/admin/partenaires"
      newLabel="Nouveau partenaire"
      emptyText="Aucun partenaire pour le moment. Ajoute le premier !"
      itemLabel={(partner) => partner.name}
      columns={[
        { header: 'Nom', cell: (partner) => partner.name },
        { header: 'Avantage', cell: (partner) => partner.advantage ?? '—' },
      ]}
    />
  );
}
