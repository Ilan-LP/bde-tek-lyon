import { Button } from '../components/Button';
import { PageHeader } from '../components/Hero';
import { Section } from '../components/Section';
import { StateMessage } from '../components/StateMessage';
import { usePageMeta } from '../lib/usePageMeta';

export function NotFoundPage() {
  usePageMeta({
    title: 'Page introuvable',
    description: 'Cette page n’existe pas ou n’existe plus.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Erreur 404"
        title="Page introuvable"
        text="Cette page s’est perdue dans les vagues."
      />
      <Section>
        <div className="mx-auto max-w-xl">
          <StateMessage action={<Button to="/">Retour à l’accueil</Button>}>
            Retourne à l’accueil pour reprendre le large.
          </StateMessage>
        </div>
      </Section>
    </>
  );
}
