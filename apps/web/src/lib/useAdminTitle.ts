import { useEffect } from 'react';

// Browser tab title of an admin page, e.g. "Clubs – Administration BDE Wave".
export function useAdminTitle(title: string) {
  useEffect(() => {
    document.title = `${title} – Administration BDE Wave`;
  }, [title]);
}
