import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataView } from '../components/DataView';
import { LogoBadge } from '../components/LogoBadge';
import { Placeholder } from '../components/Placeholder';
import { SectionTitle } from '../components/SectionTitle';
import { config } from '../lib/config';
import { mailto } from '../lib/mailto';
import type { Club } from '../lib/types';
import { useApi } from '../lib/useApi';
import { usePageMeta } from '../lib/usePageMeta';

const createClubMail = {
  subject: 'Création d’un club – BDE Wave Epitech Lyon',
  body: [
    'Bonjour,',
    '',
    'Je souhaite créer un club à Epitech Lyon.',
    '',
    'Nom du club :',
    'Activité / thème :',
    'Pourquoi ce club ? :',
    'Nombre de personnes déjà intéressées :',
    'Mon nom et ma promotion :',
    '',
    'Merci !',
  ].join('\n'),
};

export function ClubsPage() {
  usePageMeta({
    title: 'Clubs',
    description:
      'Les clubs étudiants d’Epitech Lyon : trouve celui qui te ressemble ou crée ton propre club avec le BDE Wave.',
  });
  const clubs = useApi<Club[]>('/api/clubs');

  return (
    <div>
      <SectionTitle level={1} subtitle="Des étudiants qui se retrouvent autour d’une passion.">
        Clubs
      </SectionTitle>

      <div className="mt-10">
        <DataView
          result={clubs}
          isEmpty={(list) => list.length === 0}
          empty="Aucun club n’est encore présenté ici. Tu peux être le premier à en créer un !"
        >
          {(list) => (
            <ul className="grid gap-8 md:grid-cols-2">
              {list.map((club) => (
                <li key={club.id} className="flex">
                  <Card className="flex w-full flex-col gap-4 p-6">
                    <div className="flex items-center gap-4">
                      <LogoBadge name={club.name} logoUrl={club.logoUrl} />
                      <h2 className="font-display text-wave-blue text-3xl leading-tight tracking-normal">
                        {club.name}
                      </h2>
                    </div>
                    <p className="text-2xl whitespace-pre-line">{club.description}</p>
                    {club.contactEmail && (
                      <p className="mt-auto">
                        <a
                          href={`mailto:${club.contactEmail}`}
                          className="text-wave-blue underline"
                        >
                          {club.contactEmail}
                        </a>
                      </p>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </DataView>
      </div>

      <Card className="mt-20 flex flex-col items-start gap-4 p-8">
        <h2 className="font-display text-wave-blue text-4xl tracking-normal">Créer ton club</h2>
        <p className="max-w-2xl text-2xl">
          Une idée de club ? Écris-nous : on t’aide à le lancer et à trouver tes premiers membres.
        </p>
        {config.clubEmail ? (
          <Button href={mailto(config.clubEmail, createClubMail.subject, createClubMail.body)}>
            Créer ton club
          </Button>
        ) : (
          <Placeholder what="adresse e-mail pour la création de clubs (VITE_CLUB_EMAIL)" />
        )}
      </Card>
    </div>
  );
}
