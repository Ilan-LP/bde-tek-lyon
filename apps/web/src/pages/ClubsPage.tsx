import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataView } from '../components/DataView';
import { PageHeader } from '../components/Hero';
import { LogoBadge } from '../components/LogoBadge';
import { Placeholder } from '../components/Placeholder';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { SectionTitle } from '../components/SectionTitle';
import { CardGridSkeleton } from '../components/Skeleton';
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
    <>
      <PageHeader
        eyebrow="Vie associative"
        title="Clubs"
        text="Des étudiants qui se retrouvent autour d’une passion."
      />

      <Section>
        <DataView
          result={clubs}
          skeleton={
            <CardGridSkeleton count={4} image={false} className="grid gap-6 md:grid-cols-2" />
          }
          isEmpty={(list) => list.length === 0}
          empty="Aucun club n’est encore présenté ici. Tu peux être le premier à en créer un !"
        >
          {(list) => (
            <ul className="grid gap-6 md:grid-cols-2">
              {list.map((club, index) => (
                <li key={club.id} className="flex">
                  <Reveal delay={(index % 2) * 80} className="flex w-full">
                    <Card className="flex w-full flex-col gap-4 p-6">
                      <div className="flex items-center gap-4">
                        <LogoBadge name={club.name} logoUrl={club.logoUrl} />
                        <h2 className="text-wave-navy text-xl leading-snug font-semibold">
                          {club.name}
                        </h2>
                      </div>
                      <p className="whitespace-pre-line">{club.description}</p>
                      {club.contactEmail && (
                        <p className="mt-auto">
                          <a
                            href={`mailto:${club.contactEmail}`}
                            className="text-wave-blue font-semibold underline underline-offset-4"
                          >
                            {club.contactEmail}
                          </a>
                        </p>
                      )}
                    </Card>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </DataView>
      </Section>

      <Section tone="tint" blob>
        <Reveal className="max-w-[65ch]">
          <SectionTitle
            eyebrow="Lance-toi"
            subtitle="Une idée de club ? Écris-nous : on t’aide à le lancer et à trouver tes premiers membres."
          >
            Créer ton club
          </SectionTitle>
          <div className="mt-8">
            {config.clubEmail ? (
              <Button href={mailto(config.clubEmail, createClubMail.subject, createClubMail.body)}>
                Créer ton club
              </Button>
            ) : (
              <Placeholder what="adresse e-mail pour la création de clubs (VITE_CLUB_EMAIL)" />
            )}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
