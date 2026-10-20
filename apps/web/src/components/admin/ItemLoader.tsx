import type { ReactNode } from 'react';
import { useApi } from '../../lib/useApi';
import { Button } from '../Button';
import { Card } from '../Card';
import { DataView } from '../DataView';

// The admin API has no "get one item" route, so the edit pages load the whole list
// (a few dozen rows at most) and pick the item by id.
export function ItemLoader<T extends { id: string }>({
  endpoint,
  id,
  backTo,
  children,
}: {
  endpoint: string;
  id: string;
  backTo: string;
  children: (item: T) => ReactNode;
}) {
  const result = useApi<T[]>(endpoint, { admin: true });

  const missing = (
    <Card className="p-8 text-center text-2xl">
      <p>Cet élément n’existe plus. Il a peut-être été supprimé.</p>
      <Button to={backTo} size="sm" className="mt-5">
        Retour à la liste
      </Button>
    </Card>
  );

  return (
    <DataView result={result}>
      {(items) => {
        const item = items.find((candidate) => candidate.id === id);
        return item ? children(item) : missing;
      }}
    </DataView>
  );
}
