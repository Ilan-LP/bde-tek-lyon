import type { ReactNode } from 'react';
import jellyfish from '../assets/jellyfish_skyblue.png';
import { SectionTitle } from './SectionTitle';
import { WaveDivider } from './WaveDivider';

// Soft blurred shapes of the Wave atmosphere, only used on the dark gradient.
function Blobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-wave-blue absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-60 blur-[70px]" />
      <div className="bg-wave-sky/20 absolute -bottom-40 left-1/4 h-96 w-96 rounded-full blur-[70px]" />
    </div>
  );
}

// Big home hero: Deep Navy → Main Blue gradient, eyebrow, H1, one paragraph, buttons,
// the jellyfish as an illustration on the right, and the wave divider at the bottom.
export function Hero({
  eyebrow,
  title,
  text,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="on-dark from-wave-navy to-wave-blue relative overflow-hidden bg-linear-to-br">
      <Blobs />
      <div className="container-site relative grid items-center gap-8 pt-16 pb-32 md:grid-cols-[1.25fr_1fr] md:pt-24 md:pb-44">
        <div>
          <SectionTitle level={1} tone="dark" eyebrow={eyebrow}>
            {title}
          </SectionTitle>
          <p className="text-wave-offwhite/90 mt-6 max-w-[52ch] text-lg md:text-xl">{text}</p>
          <div className="mt-8 flex flex-wrap gap-4">{actions}</div>
        </div>
        <img
          src={jellyfish}
          alt=""
          aria-hidden="true"
          className="animate-float mx-auto hidden max-h-[26rem] w-auto opacity-70 md:block"
        />
      </div>
      <WaveDivider />
    </div>
  );
}

// Compact version for inner pages: same gradient, H1, one line of text, wave divider.
export function PageHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
}) {
  return (
    <div className="on-dark from-wave-navy to-wave-blue relative overflow-hidden bg-linear-to-br">
      <Blobs />
      <img
        src={jellyfish}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[6%] hidden h-[130%] w-auto -translate-y-1/2 opacity-20 lg:block"
      />
      <div className="container-site relative pt-12 pb-24 md:pt-16 md:pb-32">
        <SectionTitle level={1} tone="dark" eyebrow={eyebrow} subtitle={text}>
          {title}
        </SectionTitle>
      </div>
      <WaveDivider />
    </div>
  );
}
