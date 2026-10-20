// "Publié" (green) when visitors can see the item, "Brouillon" (yellow) when they cannot.
export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span
      className={[
        'text-wave-navy inline-block rounded-full px-3 py-0.5 text-lg whitespace-nowrap',
        published ? 'bg-wave-green/80' : 'bg-wave-yellow/80',
      ].join(' ')}
    >
      {published ? 'Publié' : 'Brouillon'}
    </span>
  );
}
