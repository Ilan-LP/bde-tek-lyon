import type { ReactNode } from 'react';
import { useAdminTitle } from '../../lib/useAdminTitle';

// Page title (h1) of an admin page, with an optional action button on the right.
// Also sets the browser tab title.
export function AdminPageHeader({ title, action }: { title: string; action?: ReactNode }) {
  useAdminTitle(title);

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="font-display text-wave-blue text-4xl leading-tight tracking-normal md:text-5xl">
        {title}
      </h1>
      {action}
    </div>
  );
}
