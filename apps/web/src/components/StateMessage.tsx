import type { ReactNode } from 'react';
import jellyfish from '../assets/jellyfish_blue.png';
import { Card } from './Card';

// Friendly card for empty and error states: a small jellyfish and one line of text.
export function StateMessage({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center px-6 py-10 text-center">
      <img src={jellyfish} alt="" aria-hidden="true" className="h-14 w-auto opacity-80" />
      <p className="mt-4 max-w-[48ch] text-lg">{children}</p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}
