// Square logo of a club or partner. Without an uploaded logo, shows the initial in a soft outline.
export function LogoBadge({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  return (
    <div className="border-wave-blue bg-wave-offwhite/70 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`Logo ${name}`}
          loading="lazy"
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <span aria-hidden="true" className="font-display text-wave-blue text-4xl">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
