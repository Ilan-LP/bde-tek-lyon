import { Card } from '../components/Card';
import { Placeholder } from '../components/Placeholder';
import { SectionTitle } from '../components/SectionTitle';
import { site } from '../content/site';
import { config } from '../lib/config';
import { usePageMeta } from '../lib/usePageMeta';

export function AboutPage() {
  usePageMeta({
    title: 'À propos',
    description: `La mission du BDE Wave, le bureau des étudiants d’Epitech Lyon pour ${site.season}, son bureau et comment le contacter.`,
  });

  return (
    <div className="space-y-20">
      <section>
        <SectionTitle level={1} subtitle={`Le BDE d’Epitech Lyon, ${site.season}.`}>
          À propos
        </SectionTitle>
      </section>

      <section>
        <SectionTitle>Notre mission</SectionTitle>
        <div className="mt-6 max-w-3xl space-y-4 text-2xl leading-relaxed">
          {site.mission.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {site.pillars.map((pillar) => (
            <li key={pillar.title} className="flex">
              <Card className="w-full p-6">
                <h3 className="font-display text-wave-blue text-3xl tracking-normal">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-2xl">{pillar.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle subtitle={`Les étudiants qui animent Wave en ${site.season}.`}>
          Le bureau
        </SectionTitle>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {site.bureau.map((member, index) => (
            <li key={member.name ?? index} className="flex">
              <Card className="w-full p-6">
                <p className="font-display text-wave-blue text-3xl leading-tight tracking-normal">
                  {member.name ?? <Placeholder what="prénom et nom" />}
                </p>
                <p className="mt-2 text-2xl">{member.role ?? <Placeholder what="rôle" />}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Nous contacter</SectionTitle>
        <Card className="mt-8 max-w-2xl space-y-4 p-8 text-2xl">
          <p>
            <span className="text-wave-blue">Le BDE, les clubs : </span>
            {config.clubEmail ? (
              <a href={`mailto:${config.clubEmail}`} className="underline">
                {config.clubEmail}
              </a>
            ) : (
              <Placeholder what="adresse e-mail de contact (VITE_CLUB_EMAIL)" />
            )}
          </p>
          <p>
            <span className="text-wave-blue">Partenariats : </span>
            {config.partnershipEmail ? (
              <a href={`mailto:${config.partnershipEmail}`} className="underline">
                {config.partnershipEmail}
              </a>
            ) : (
              <Placeholder what="adresse e-mail des partenariats (VITE_PARTNERSHIP_EMAIL)" />
            )}
          </p>
        </Card>
      </section>
    </div>
  );
}
