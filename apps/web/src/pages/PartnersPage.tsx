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
import type { Partner } from '../lib/types';
import { useApi } from '../lib/useApi';
import { usePageMeta } from '../lib/usePageMeta';

const partnershipMail = {
  subject: 'Demande de partenariat – BDE Wave Epitech Lyon',
  body: [
    'Bonjour,',
    '',
    'Nous souhaitons devenir partenaire du BDE Wave d’Epitech Lyon.',
    '',
    'Nom de l’entreprise :',
    'Site web :',
    'Nom et téléphone de la personne à contacter :',
    'Avantage proposé aux étudiants :',
    '',
    'Dans l’attente de votre retour,',
    'Cordialement.',
  ].join('\n'),
};

export function PartnersPage() {
  usePageMeta({
    title: 'Partenaires',
    description:
      'Les partenaires du BDE Wave : les avantages réservés aux étudiants d’Epitech Lyon, et comment devenir partenaire.',
  });
  const partners = useApi<Partner[]>('/api/partners');

  return (
    <>
      <PageHeader
        eyebrow="Avantages étudiants"
        title="Partenaires"
        text="Des avantages réservés aux étudiants d’Epitech Lyon."
      />

      <Section>
        <DataView
          result={partners}
          skeleton={
            <CardGridSkeleton count={4} image={false} className="grid gap-6 md:grid-cols-2" />
          }
          isEmpty={(list) => list.length === 0}
          empty="Aucun partenaire à afficher pour le moment."
        >
          {(list) => (
            <ul className="grid gap-6 md:grid-cols-2">
              {list.map((partner, index) => (
                <li key={partner.id} className="flex">
                  <Reveal delay={(index % 2) * 80} className="flex w-full">
                    <Card className="flex w-full flex-col gap-4 p-6">
                      <div className="flex items-center gap-4">
                        <LogoBadge name={partner.name} logoUrl={partner.logoUrl} />
                        <h2 className="text-wave-navy text-xl leading-snug font-semibold">
                          {partner.name}
                        </h2>
                      </div>
                      <p className="whitespace-pre-line">{partner.description}</p>
                      {partner.advantage && (
                        <p className="bg-wave-green/50 text-wave-navy rounded-xl px-4 py-3">
                          <span className="font-label tracking-wave block text-lg">
                            Avantage étudiant
                          </span>
                          {partner.advantage}
                        </p>
                      )}
                      {partner.websiteUrl && (
                        <div className="mt-auto pt-2">
                          <Button href={partner.websiteUrl} size="sm" variant="secondary">
                            Voir le site
                          </Button>
                        </div>
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
            eyebrow="Rejoins-nous"
            subtitle="Commerçant, entreprise ou association : proposez un avantage aux étudiants d’Epitech Lyon et gagnez en visibilité sur le campus."
          >
            Devenir partenaire
          </SectionTitle>
          <div className="mt-8">
            {config.partnershipEmail ? (
              <Button
                href={mailto(
                  config.partnershipEmail,
                  partnershipMail.subject,
                  partnershipMail.body,
                )}
              >
                Devenir partenaire
              </Button>
            ) : (
              <Placeholder what="adresse e-mail des partenariats (VITE_PARTNERSHIP_EMAIL)" />
            )}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
