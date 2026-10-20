/// <reference types="vite/client" />

// The VITE_ variables read by the site (see .env.example).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_CLUB_EMAIL?: string;
  readonly VITE_PARTNERSHIP_EMAIL?: string;
}
