import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataView } from '../components/DataView';
import { LogoBadge } from '../components/LogoBadge';
import { Placeholder } from '../components/Placeholder';
import { SectionTitle } from '../components/SectionTitle';
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
    <div>
      <SectionTitle level={1} subtitle="Des avantages réservés aux étudiants d’Epitech Lyon.">
        Partenaires
      </SectionTitle>

      <div className="mt-10">
        <DataView
          result={partners}
          isEmpty={(list) => list.length === 0}
          empty="Aucun partenaire à afficher pour le moment."
        >
          {(list) => (
            <ul className="grid gap-8 md:grid-cols-2">
              {list.map((partner) => (
                <li key={partner.id} className="flex">
                  <Card className="flex w-full flex-col gap-4 p-6">
                    <div className="flex items-center gap-4">
                      <LogoBadge name={partner.name} logoUrl={partner.logoUrl} />
                      <h2 className="font-display text-wave-blue text-3xl leading-tight tracking-normal">
                        {partner.name}
                      </h2>
                    </div>
                    <p className="text-2xl whitespace-pre-line">{partner.description}</p>
                    {partner.advantage && (
                      <p className="bg-wave-green/60 rounded-2xl px-4 py-3 text-2xl">
                        <span className="text-wave-blue">Avantage étudiant : </span>
                        {partner.advantage}
                      </p>
                    )}
                    {partner.websiteUrl && (
                      <div className="mt-auto pt-2">
                        <Button href={partner.websiteUrl} size="sm">
                          Voir le site
                        </Button>
                      </div>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </DataView>
      </div>

      <Card className="mt-20 flex flex-col items-start gap-4 p-8">
        <h2 className="font-display text-wave-blue text-4xl tracking-normal">Devenir partenaire</h2>
        <p className="max-w-2xl text-2xl">
          Commerçant, entreprise ou association : proposez un avantage aux étudiants d’Epitech Lyon
          et gagnez en visibilité sur le campus.
        </p>
        {config.partnershipEmail ? (
          <Button
            href={mailto(config.partnershipEmail, partnershipMail.subject, partnershipMail.body)}
          >
            Devenir partenaire
          </Button>
        ) : (
          <Placeholder what="adresse e-mail des partenariats (VITE_PARTNERSHIP_EMAIL)" />
        )}
      </Card>
    </div>
  );
}
