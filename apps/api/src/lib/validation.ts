import { z } from 'zod';

// Emails are stored lowercase so that the unique constraint is case-insensitive in practice.
export const emailSchema = z.email().trim().toLowerCase();

// Length limits: 12 minimum for security, 128 maximum so nobody can make us hash a huge string.
export const passwordSchema = z.string().min(12).max(128);
