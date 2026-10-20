// Build-time configuration, read from the VITE_ variables of the root .env (see .env.example).

const clean = (value: string | undefined) => value?.trim() || undefined;

export const config = {
  // Base URL of the API, without trailing slash. An empty string means "same origin"
  // (API behind the same reverse proxy as the site). The default is for local development.
  apiUrl: (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, ''),
  // Both can be undefined: pages then show an "À COMPLÉTER" marker instead of a broken link.
  clubEmail: clean(import.meta.env.VITE_CLUB_EMAIL),
  partnershipEmail: clean(import.meta.env.VITE_PARTNERSHIP_EMAIL),
};
