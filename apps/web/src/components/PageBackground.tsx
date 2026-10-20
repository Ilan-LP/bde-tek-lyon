import type { ReactNode } from 'react';

// Page shell: a plain Off-White canvas. The Wave atmosphere (gradient, blobs, jellyfish) lives
// in the hero / page header and in one subtle blob (`Section blob`), never behind body text.
export function PageBackground({ children }: { children: ReactNode }) {
  return <div className="bg-wave-offwhite flex min-h-screen flex-col">{children}</div>;
}
