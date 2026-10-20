import { z } from 'zod';

// Only the variables the API actually uses today are validated here.
// Add the others (DATABASE_URL, JWT_SECRET...) in the task that needs them.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
});

export const env = envSchema.parse(process.env);
