import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataView } from '../components/DataView';
import { EventCard } from '../components/EventCard';
import { Hero } from '../components/Hero';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { SectionTitle } from '../components/SectionTitle';
import { site } from '../content/site';
import type { Club, EventItem, Partner } from '../lib/types';
import { useApi } from '../lib/useApi';
import { usePageMeta } from '../lib/usePageMeta';

// Slim info strip filled with real numbers from the API. Shows only the counts above zero,
// and nothing at all while loading or on error (it is a bonus, not a content block).
function Stats({ counts }: { counts: { label: string; value: number | undefined }[] }) {
  const items = counts.filter((item) => item.value !== undefined && item.value > 0);
  if (items.length === 0) return null;
  return (
    <dl className="border-wave-sky bg-wave-offwhite shadow-card rounded-card mb-12 grid grid-cols-3 divide-x divide-wave-sky border md:mb-16">
      {items.map((item) => (
        <div key={item.label} className="px-3 py-5 text-center md:px-6">
          <dd className="font-label tracking-wave text-wave-blue text-4xl leading-none md:text-5xl">
            {item.value}
          </dd>
          <dt className="font-label tracking-wave text-wave-muted mt-1 text-base md:text-lg">
            {item.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

export function HomePage() {
  usePageMeta({
    description:
      'BDE Wave, le bureau des étudiants d’Epitech Lyon : retrouve les prochains événements, les clubs et les avantages de nos partenaires.',
  });
  const events = useApi<EventItem[]>('/api/events');
  const clubs = useApi<Club[]>('/api/clubs');
  const partners = useApi<Partner[]>('/api/partners');

  const stats = [
    { label: 'Événements à venir', value: events.data?.length },
    { label: 'Clubs', value: clubs.data?.length },
    { label: 'Partenaires', value: partners.data?.length },
  ];

  return (
    <>
      <Hero
        eyebrow={`${site.school} · ${site.season}`}
        title="Le BDE qui fait vivre le campus"
        text="Soirées, événements, clubs et avantages chez nos partenaires : on organise tout ce qui rend la vie à Epitech Lyon plus vivante, en dehors des cours."
        actions={
          <>
            <Button to="/evenements" variant="light">
              Voir les événements
            </Button>
            <Button to="/clubs" variant="ghost">
              Rejoindre un club
            </Button>
          </>
        }
      />

      <Section>
        <Stats counts={stats} />
        <Reveal>
          <SectionTitle eyebrow="Agenda" subtitle="Les prochains rendez-vous à ne pas manquer.">
            Prochains événements
          </SectionTitle>
        </Reveal>
        <div className="mt-10">
          <DataView
            result={events}
            isEmpty={(list) => list.length === 0}
            empty="Aucun événement n’est prévu pour le moment. Reviens bientôt !"
          >
            {(list) => (
              <>
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {list.slice(0, 3).map((event, index) => (
                    <li key={event.id} className="flex">
                      <Reveal delay={index * 80} className="flex w-full">
                        <EventCard event={event} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Button to="/evenements" variant="secondary">
                    Tous les événements
                  </Button>
                </div>
              </>
            )}
          </DataView>
        </div>
      </Section>

      <Section tone="tint" blob>
        <ul className="grid gap-6 md:grid-cols-2">
          <li className="flex">
            <Reveal className="flex w-full">
              <Card className="flex w-full flex-col items-start gap-4 p-8">
                <p className="font-label tracking-wave text-wave-blue text-xl">Vie associative</p>
                <h2 className="font-display text-h2 text-wave-navy">Les clubs</h2>
                <p className="max-w-[48ch]">
                  Trouve le club qui te ressemble, ou crée le tien : il suffit d’une idée et de
                  quelques motivés.
                </p>
                <Button to="/clubs" className="mt-auto">
                  Découvrir les clubs
                </Button>
              </Card>
            </Reveal>
          </li>
          <li className="flex">
            <Reveal delay={80} className="flex w-full">
              <Card className="flex w-full flex-col items-start gap-4 p-8">
                <p className="font-label tracking-wave text-wave-blue text-xl">
                  Avantages étudiants
                </p>
                <h2 className="font-display text-h2 text-wave-navy">Les partenaires</h2>
                <p className="max-w-[48ch]">
                  Des avantages réservés aux étudiants d’Epitech Lyon chez les commerçants et
                  entreprises qui nous soutiennent.
                </p>
                <Button to="/partenaires" className="mt-auto">
                  Voir les avantages
                </Button>
              </Card>
            </Reveal>
          </li>
        </ul>
      </Section>

      <Section>
        <Reveal className="mx-auto max-w-[65ch] text-center">
          <h2 className="font-display text-h2 text-wave-navy">Une question ?</h2>
          <p className="mt-4">
            Une idée d’événement, une envie de rejoindre le bureau ? Écris-nous, on te répond
            volontiers.
          </p>
          <div className="mt-6">
            <Button to="/a-propos" variant="secondary">
              Contacter le bureau
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
