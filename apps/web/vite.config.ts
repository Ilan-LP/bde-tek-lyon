import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The single .env lives at the repo root. Vite only exposes the variables starting with
  // VITE_ to the browser, so secrets such as JWT_SECRET never reach the frontend.
  envDir: '../..',
});
