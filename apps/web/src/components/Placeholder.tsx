// Marks information the BDE still has to provide. Clearly visible on purpose: it must never
// reach the public site unnoticed. `what` says exactly what is missing.
export function Placeholder({ what }: { what: string }) {
  return (
    <span className="bg-wave-yellow/70 text-wave-navy rounded-lg px-2 py-0.5">
      [À COMPLÉTER : {what}]
    </span>
  );
}
