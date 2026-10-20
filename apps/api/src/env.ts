import { z } from 'zod';
import { emailSchema, passwordSchema } from './lib/validation.js';

// Only the variables the API actually uses today are validated here.
// Add the others (PARTNERSHIP_EMAIL, CLUB_EMAIL...) in the task that needs them.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'must be at least 32 characters (try: openssl rand -base64 48)'),
  // Used once, to create the first admin when the Admin table is empty.
  ADMIN_EMAIL: emailSchema,
  ADMIN_PASSWORD: passwordSchema,
  // Reduced to its origin (no path, no trailing slash): it is the only origin allowed by CORS.
  PUBLIC_SITE_URL: z.url().transform((url) => new URL(url).origin),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables (see .env.example):');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
