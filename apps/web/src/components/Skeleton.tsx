// Loading placeholders: soft Sky Blue blocks that pulse (only for visitors who accept motion).
function Bar({ className }: { className: string }) {
  return <div className={['bg-wave-sky/60 rounded-lg', className].join(' ')} />;
}

function SkeletonCard({ image }: { image: boolean }) {
  return (
    <div className="border-wave-sky bg-wave-offwhite shadow-card rounded-card w-full overflow-hidden border">
      {image && <div className="bg-wave-sky/60 aspect-video w-full" />}
      <div className="space-y-3 p-5">
        <Bar className="h-6 w-24 rounded-full" />
        <Bar className="h-6 w-4/5" />
        <Bar className="h-4 w-3/5" />
      </div>
    </div>
  );
}

// A grid of card placeholders, announced once to screen readers.
export function CardGridSkeleton({
  count = 3,
  image = true,
  className = 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number;
  image?: boolean;
  className?: string;
}) {
  return (
    <div role="status" aria-label="Chargement" className="motion-safe:animate-pulse">
      <div className={className}>
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCard key={index} image={image} />
        ))}
      </div>
    </div>
  );
}
