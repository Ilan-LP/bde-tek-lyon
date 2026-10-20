import { useState } from 'react';
import { Button } from '../components/Button';
import { DataView } from '../components/DataView';
import { EventCard } from '../components/EventCard';
import { SectionTitle } from '../components/SectionTitle';
import type { EventItem } from '../lib/types';
import { useApi } from '../lib/useApi';
import { usePageMeta } from '../lib/usePageMeta';

export function EventsPage() {
  usePageMeta({
    title: 'Événements',
    description:
      'Soirées, rencontres et animations du BDE Wave : consulte les événements à venir d’Epitech Lyon et retrouve ceux déjà passés.',
  });
  const [showPast, setShowPast] = useState(false);
  const events = useApi<EventItem[]>(showPast ? '/api/events?past=true' : '/api/events');

  return (
    <div>
      <SectionTitle level={1} subtitle="Tout ce qui se passe à Epitech Lyon.">
        Événements
      </SectionTitle>

      <div role="group" aria-label="Type d’événements" className="mt-8 flex flex-wrap gap-4">
        <Button size="sm" pressed={!showPast} onClick={() => setShowPast(false)}>
          À venir
        </Button>
        <Button size="sm" pressed={showPast} onClick={() => setShowPast(true)}>
          Passés
        </Button>
      </div>

      <div className="mt-10">
        <DataView
          result={events}
          isEmpty={(list) => list.length === 0}
          empty={
            showPast
              ? 'Aucun événement passé à afficher.'
              : 'Aucun événement à venir pour le moment. Reviens vite !'
          }
        >
          {(list) => (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {list.map((event) => (
                <li key={event.id} className="flex">
                  <EventCard event={event} past={showPast} />
                </li>
              ))}
            </ul>
          )}
        </DataView>
      </div>
    </div>
  );
}
