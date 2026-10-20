import { useParams } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataView } from '../components/DataView';
import { SectionTitle } from '../components/SectionTitle';
import { formatEventWhen } from '../lib/format';
import type { EventItem } from '../lib/types';
import { useApi } from '../lib/useApi';
import { usePageMeta } from '../lib/usePageMeta';

export function EventDetailPage() {
  const { slug = '' } = useParams();
  const event = useApi<EventItem>(`/api/events/${encodeURIComponent(slug)}`);
  const data = event.data;

  usePageMeta({
    title: data?.title ?? 'Événement',
    description: data
      ? `${data.title} – ${formatEventWhen(data.startsAt, data.endsAt)}, ${data.location}.`
      : 'Détail d’un événement du BDE Wave à Epitech Lyon.',
    image: data?.imageUrl ?? undefined,
  });

  const backLink = (
    <Button to="/evenements" size="sm">
      ← Tous les événements
    </Button>
  );

  return (
    <div>
      <div className="mb-8">{backLink}</div>
      <DataView
        result={event}
        notFound={
          <Card className="p-8 text-center">
            <SectionTitle level={1}>Événement introuvable</SectionTitle>
            <p className="mx-auto mt-4 max-w-xl text-2xl">
              Cet événement n’existe pas ou n’est plus affiché. Regarde les autres événements du BDE
              !
            </p>
          </Card>
        }
      >
        {(item) => (
          <article className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionTitle level={1}>{item.title}</SectionTitle>
              <p className="mt-6 text-2xl">{formatEventWhen(item.startsAt, item.endsAt)}</p>
              <p className="text-wave-blue mt-1 text-2xl">{item.location}</p>
              <p className="mt-8 max-w-2xl text-2xl leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
              {item.registrationUrl && (
                <div className="mt-10">
                  <Button href={item.registrationUrl}>S’inscrire</Button>
                </div>
              )}
            </div>
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={`Affiche de l’événement ${item.title}`}
                className="border-wave-blue w-full self-start rounded-3xl border-4 object-cover"
              />
            )}
          </article>
        )}
      </DataView>
    </div>
  );
}
