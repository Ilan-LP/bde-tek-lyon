import { defineConfig } from 'prisma/config';

// Prisma 7 reads the connection URL from here, not from schema.prisma.
// The URL is only needed by commands that reach the database (migrate...),
// not by `prisma generate`, so a missing value is tolerated for now.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env['DATABASE_URL'] ?? '' },
});
