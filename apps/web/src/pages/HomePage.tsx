import { Link } from 'react-router';
import logo from '../assets/wave_logo_blue.png';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataView } from '../components/DataView';
import { EventCard } from '../components/EventCard';
import { SectionTitle } from '../components/SectionTitle';
import { site } from '../content/site';
import type { EventItem } from '../lib/types';
import { useApi } from '../lib/useApi';
import { usePageMeta } from '../lib/usePageMeta';

export function HomePage() {
  usePageMeta({
    description:
      'BDE Wave, le bureau des étudiants d’Epitech Lyon : retrouve les prochains événements, les clubs et les avantages de nos partenaires.',
  });
  const events = useApi<EventItem[]>('/api/events');

  return (
    <div className="space-y-24 md:space-y-32">
      <section className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-wave-blue text-2xl">
            {site.school} · {site.season}
          </p>
          <h1 className="font-display text-wave-blue mt-3 text-6xl leading-none tracking-normal md:text-8xl">
            {site.name}
          </h1>
          <p className="mt-6 max-w-xl text-2xl md:text-3xl">
            {site.tagline}. On organise les soirées, les événements et les clubs qui font vivre le
            campus, et on te trouve des avantages chez nos partenaires.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/evenements">Voir les événements</Button>
            <Button to="/clubs">Rejoindre un club</Button>
          </div>
        </div>
        <img
          src={logo}
          alt={`Logo ${site.name}`}
          className="drop-shadow-logo mx-auto w-56 md:w-full md:max-w-sm"
        />
      </section>

      <section>
        <SectionTitle subtitle="Les trois prochains rendez-vous à ne pas manquer.">
          Prochains événements
        </SectionTitle>
        <div className="mt-10">
          <DataView
            result={events}
            isEmpty={(list) => list.length === 0}
            empty="Aucun événement n’est prévu pour le moment. Reviens bientôt !"
          >
            {(list) => (
              <>
                <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {list.slice(0, 3).map((event) => (
                    <li key={event.id} className="flex">
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Button to="/evenements">Tous les événements</Button>
                </div>
              </>
            )}
          </DataView>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col items-start gap-4 p-8">
          <h2 className="font-display text-wave-blue text-4xl tracking-normal">Les clubs</h2>
          <p className="text-2xl">
            Trouve le club qui te ressemble, ou crée le tien : il suffit d’une idée et de quelques
            motivés.
          </p>
          <Button to="/clubs" className="mt-auto">
            Découvrir les clubs
          </Button>
        </Card>
        <Card className="flex flex-col items-start gap-4 p-8">
          <h2 className="font-display text-wave-blue text-4xl tracking-normal">Les partenaires</h2>
          <p className="text-2xl">
            Des avantages réservés aux étudiants d’Epitech Lyon chez les commerçants et entreprises
            qui nous soutiennent.
          </p>
          <Button to="/partenaires" className="mt-auto">
            Voir les avantages
          </Button>
        </Card>
      </section>

      <p className="text-center">
        Une question ?{' '}
        <Link to="/a-propos" className="text-wave-blue underline">
          Contacte le bureau
        </Link>
        .
      </p>
    </div>
  );
}
