// Square logo of a club or partner. Without an uploaded logo, shows the initial on a soft gradient.
export function LogoBadge({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  return (
    <div className="border-wave-sky bg-wave-offwhite flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`Logo ${name}`}
          loading="lazy"
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <span
          aria-hidden="true"
          className="from-wave-sky to-wave-tint font-display text-wave-blue flex h-full w-full items-center justify-center bg-linear-to-br text-3xl"
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
