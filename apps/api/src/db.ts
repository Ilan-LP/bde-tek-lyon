import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env.js';
import { PrismaClient } from './generated/prisma/client.js';

// Prisma 7 talks to PostgreSQL through a driver adapter.
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});
