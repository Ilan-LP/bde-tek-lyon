import { Card } from '../components/Card';
import { PageHeader } from '../components/Hero';
import { Placeholder } from '../components/Placeholder';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { SectionTitle } from '../components/SectionTitle';
import { site } from '../content/site';
import { config } from '../lib/config';
import { usePageMeta } from '../lib/usePageMeta';

// One accent colour per pillar, used sparingly as a small dot.
const pillarAccents = ['bg-wave-yellow', 'bg-wave-green', 'bg-wave-pink'];

export function AboutPage() {
  usePageMeta({
    title: 'À propos',
    description: `La mission du BDE Wave, le bureau des étudiants d’Epitech Lyon pour ${site.season}, son bureau et comment le contacter.`,
  });

  return (
    <>
      <PageHeader
        eyebrow="Le BDE"
        title="À propos"
        text={`Le BDE d’Epitech Lyon, ${site.season}.`}
      />

      <Section>
        <Reveal>
          <SectionTitle eyebrow="Pourquoi Wave">Notre mission</SectionTitle>
        </Reveal>
        <div className="mt-6 max-w-[65ch] space-y-4 text-lg">
          {site.mission.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {site.pillars.map((pillar, index) => (
            <li key={pillar.title} className="flex">
              <Reveal delay={index * 80} className="flex w-full">
                <Card className="w-full p-6">
                  <span
                    aria-hidden="true"
                    className={[
                      'font-label text-wave-navy mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-xl',
                      pillarAccents[index % pillarAccents.length],
                    ].join(' ')}
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-wave-navy text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-2">{pillar.text}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" blob>
        <Reveal>
          <SectionTitle
            eyebrow="L’équipe"
            subtitle={`Les étudiants qui animent Wave en ${site.season}.`}
          >
            Le bureau
          </SectionTitle>
        </Reveal>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {site.bureau.map((member, index) => (
            <li key={member.name ?? index} className="flex">
              <Reveal delay={index * 80} className="flex w-full">
                <Card className="w-full p-6">
                  <p className="text-wave-navy text-xl leading-snug font-semibold">
                    {member.name ?? <Placeholder what="prénom et nom" />}
                  </p>
                  <p className="text-wave-muted mt-2">
                    {member.role ?? <Placeholder what="rôle" />}
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Reveal>
          <SectionTitle eyebrow="Écris-nous">Nous contacter</SectionTitle>
          <Card className="mt-8 max-w-2xl space-y-5 p-8">
            <p>
              <span className="font-label tracking-wave text-wave-blue block text-lg">
                Le BDE, les clubs
              </span>
              {config.clubEmail ? (
                <a
                  href={`mailto:${config.clubEmail}`}
                  className="text-wave-blue font-semibold break-all underline underline-offset-4"
                >
                  {config.clubEmail}
                </a>
              ) : (
                <Placeholder what="adresse e-mail de contact (VITE_CLUB_EMAIL)" />
              )}
            </p>
            <p>
              <span className="font-label tracking-wave text-wave-blue block text-lg">
                Partenariats
              </span>
              {config.partnershipEmail ? (
                <a
                  href={`mailto:${config.partnershipEmail}`}
                  className="text-wave-blue font-semibold break-all underline underline-offset-4"
                >
                  {config.partnershipEmail}
                </a>
              ) : (
                <Placeholder what="adresse e-mail des partenariats (VITE_PARTNERSHIP_EMAIL)" />
              )}
            </p>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
