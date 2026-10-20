// The "wave" signature: an SVG curve that flows from a dark header into the next section.
// It is filled with the colour of that next section (`text-*` class, via currentColor).
export function WaveDivider({ className = 'text-wave-offwhite' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={['absolute inset-x-0 -bottom-px block h-10 w-full md:h-20', className].join(' ')}
    >
      <path
        fill="currentColor"
        d="M0 56C160 96 320 96 520 60C720 24 860 8 1040 36C1200 62 1330 70 1440 44V96H0Z"
      />
    </svg>
  );
}
