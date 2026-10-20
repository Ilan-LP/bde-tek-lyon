import { Button } from '../components/Button';
import { SectionTitle } from '../components/SectionTitle';
import { usePageMeta } from '../lib/usePageMeta';

export function NotFoundPage() {
  usePageMeta({
    title: 'Page introuvable',
    description: 'Cette page n’existe pas ou n’existe plus.',
  });

  return (
    <div className="py-10 text-center md:py-20">
      <p className="font-display text-wave-blue text-8xl md:text-9xl">404</p>
      <SectionTitle level={1} className="mt-4 flex flex-col items-center">
        Page introuvable
      </SectionTitle>
      <p className="mx-auto mt-4 max-w-xl text-2xl">
        Cette page s’est perdue dans les vagues. Retourne à l’accueil pour reprendre le large.
      </p>
      <div className="mt-8">
        <Button to="/">Retour à l’accueil</Button>
      </div>
    </div>
  );
}
