import { useParams } from 'react-router';
import jellyfish from '../assets/jellyfish_skyblue.png';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataView } from '../components/DataView';
import { PageHeader } from '../components/Hero';
import { Section } from '../components/Section';
import { CardGridSkeleton } from '../components/Skeleton';
import { StateMessage } from '../components/StateMessage';
import { formatEventWhen } from '../lib/format';
import type { EventItem } from '../lib/types';
import { useApi } from '../lib/useApi';
import { usePageMeta } from '../lib/usePageMeta';

export function EventDetailPage() {
  const { slug = '' } = useParams();
  const event = useApi<EventItem>(`/api/events/${encodeURIComponent(slug)}`);
  const data = event.data;
  const notFound = event.error?.status === 404;

  usePageMeta({
    title: data?.title ?? 'Événement',
    description: data
      ? `${data.title} – ${formatEventWhen(data.startsAt, data.endsAt)}, ${data.location}.`
      : 'Détail d’un événement du BDE Wave à Epitech Lyon.',
    image: data?.imageUrl ?? undefined,
  });

  return (
    <>
      <PageHeader
        eyebrow="Événement"
        title={data?.title ?? (notFound ? 'Événement introuvable' : 'Événement')}
        text={
          data ? `${formatEventWhen(data.startsAt, data.endsAt)} · ${data.location}` : undefined
        }
      />

      <Section>
        <div className="mb-10">
          <Button to="/evenements" size="sm" variant="secondary">
            ← Tous les événements
          </Button>
        </div>
        <DataView
          result={event}
          skeleton={<CardGridSkeleton count={1} className="grid max-w-2xl" />}
          notFound={
            <StateMessage
              action={
                <Button to="/evenements" size="sm">
                  Voir les événements
                </Button>
              }
            >
              Cet événement n’existe pas ou n’est plus affiché. Regarde les autres événements du BDE
              !
            </StateMessage>
          }
        >
          {(item) => (
            <article className="grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <h2 className="sr-only">Description</h2>
                <p className="max-w-[65ch] text-lg leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              <div className="space-y-6">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={`Affiche de l’événement ${item.title}`}
                    className="border-wave-sky shadow-card rounded-card w-full border object-cover"
                  />
                ) : (
                  <div className="from-wave-navy to-wave-blue rounded-card shadow-card flex aspect-video w-full items-center justify-center overflow-hidden bg-linear-to-br">
                    <img
                      src={jellyfish}
                      alt=""
                      aria-hidden="true"
                      className="h-4/5 w-auto opacity-60"
                    />
                  </div>
                )}
                <Card className="space-y-4 p-6">
                  <div>
                    <p className="font-label tracking-wave text-wave-blue text-lg">Quand</p>
                    <p>{formatEventWhen(item.startsAt, item.endsAt)}</p>
                  </div>
                  <div>
                    <p className="font-label tracking-wave text-wave-blue text-lg">Où</p>
                    <p>{item.location}</p>
                  </div>
                  {item.registrationUrl && <Button href={item.registrationUrl}>S’inscrire</Button>}
                </Card>
              </div>
            </article>
          )}
        </DataView>
      </Section>
    </>
  );
}
