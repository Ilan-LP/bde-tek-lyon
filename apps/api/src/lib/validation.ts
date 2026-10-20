import { z } from 'zod';

// Emails are stored lowercase so that the unique constraint is case-insensitive in practice.
export const emailSchema = z.email().trim().toLowerCase();

// Length limits: 12 minimum for security, 128 maximum so nobody can make us hash a huge string.
export const passwordSchema = z.string().min(12).max(128);

// Primary keys are UUIDs: reject anything else before it reaches the database.
export const idSchema = z.uuid();

// Only http(s) links are accepted: z.url() alone would also let "javascript:..." through.
export const httpUrlSchema = z
  .url({ protocol: /^https?$/ })
  .trim()
  .max(2048);

// ISO 8601 with an explicit offset or "Z", e.g. 2026-11-05T18:30:00+01:00. Converted to a Date.
export const isoDateSchema = z.iso.datetime({ offset: true }).transform((value) => new Date(value));

// Required text field with a maximum length.
export const textSchema = (max: number) => z.string().trim().min(1).max(max);
