import type { ReactNode } from 'react';
import jellyfish from '../assets/jellyfish_skyblue.png';

// The Wave atmosphere (brand/visual_identity.md): a soft radial gradient Sky Blue → Off-White,
// a few blurred pastel blobs in the corners and the jellyfish as a faint watermark.
// The decorative layer is fixed behind the content, so it looks the same on every page length.
export function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="from-wave-sky to-wave-offwhite absolute inset-0 bg-radial-[ellipse_at_top_left]" />
        <div className="bg-wave-sky/80 absolute -top-24 -left-32 h-96 w-96 rounded-full blur-[64px]" />
        <div className="bg-wave-offwhite absolute top-1/3 -right-24 h-80 w-80 rounded-full blur-[70px]" />
        <div className="bg-wave-sky/70 absolute -bottom-32 left-1/4 h-96 w-96 rounded-full blur-[60px]" />
        {/* Tucked in a corner, behind the content, at about 35% opacity. */}
        <img
          src={jellyfish}
          alt=""
          className="absolute -right-12 -bottom-16 w-56 opacity-35 md:-right-8 md:w-80"
        />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
