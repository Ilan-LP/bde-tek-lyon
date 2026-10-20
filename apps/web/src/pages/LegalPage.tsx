import type { ReactNode } from 'react';
import { Placeholder } from '../components/Placeholder';
import { SectionTitle } from '../components/SectionTitle';
import { site } from '../content/site';
import { config } from '../lib/config';
import { usePageMeta } from '../lib/usePageMeta';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-wave-blue text-3xl tracking-normal">{title}</h2>
      <div className="mt-4 space-y-2 text-2xl leading-relaxed">{children}</div>
    </section>
  );
}

// Shows the value when provided, otherwise a visible "À COMPLÉTER" marker.
function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <p>
      <span className="text-wave-blue">{label} : </span>
      {value ?? <Placeholder what={label.toLowerCase()} />}
    </p>
  );
}

export function LegalPage() {
  usePageMeta({
    title: 'Mentions légales',
    description: `Mentions légales du site du ${site.name}, bureau des étudiants d’${site.school} : éditeur, hébergeur et données personnelles.`,
  });
  const { legal } = site;

  return (
    <div className="max-w-3xl space-y-14">
      <SectionTitle level={1}>Mentions légales</SectionTitle>

      <Block title="Éditeur du site">
        <Field label="Nom" value={legal.legalName} />
        <Field label="Statut" value={legal.status} />
        <Field label="Forme juridique précise" value={legal.legalForm} />
        <Field label="Siège social" value={legal.registeredOffice} />
        <Field label="Numéro d’enregistrement (RNA ou SIRET)" value={legal.registrationNumber} />
        <Field
          label="Directeur ou directrice de la publication"
          value={legal.publicationDirector}
        />
        <p>
          <span className="text-wave-blue">Contact : </span>
          {config.clubEmail ? (
            <a href={`mailto:${config.clubEmail}`} className="underline">
              {config.clubEmail}
            </a>
          ) : (
            <Placeholder what="adresse e-mail de contact (VITE_CLUB_EMAIL)" />
          )}
        </p>
      </Block>

      <Block title="Hébergeur">
        <Field label="Nom de l’hébergeur" value={legal.host.name} />
        <Field label="Adresse de l’hébergeur" value={legal.host.address} />
        <Field label="Contact de l’hébergeur" value={legal.host.contact} />
      </Block>

      <Block title="Données personnelles">
        <p>
          Ce site ne dépose aucun cookie de suivi et ne collecte aucune donnée personnelle auprès de
          ses visiteurs. Les demandes de création de club ou de partenariat passent par ta
          messagerie : le BDE reçoit uniquement le message que tu envoies et ne l’utilise que pour
          te répondre.
        </p>
        <p>Pour toute question sur tes données, écris-nous à l’adresse de contact ci-dessus.</p>
      </Block>

      <Block title="Propriété intellectuelle">
        <p>
          Le nom, le logo et les visuels du BDE Wave sont la propriété du BDE. Toute reproduction
          nécessite son accord préalable. Les logos des clubs et des partenaires appartiennent à
          leurs propriétaires respectifs.
        </p>
      </Block>
    </div>
  );
}
