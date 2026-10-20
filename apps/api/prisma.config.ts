import { defineConfig } from 'prisma/config';

// Prisma 7 does not load .env by itself. Load the root one (path relative to
// apps/api, where the scripts run). Variables already set in the environment win.
try {
  process.loadEnvFile('../../.env');
} catch {
  // No .env file (e.g. in production): rely on real environment variables.
}

// Prisma 7 reads the connection URL from here, not from schema.prisma.
// The URL is only needed by commands that reach the database (migrate...),
// not by `prisma generate`, so a missing value is tolerated.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env['DATABASE_URL'] ?? '' },
});
