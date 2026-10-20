import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { emailSchema } from '../lib/validation.js';
import { getDummyHash, verifyPassword } from '../lib/password.js';
import {
  sessionCookieOptions,
  sessionMaxAgeMs,
  SESSION_COOKIE,
  signSessionToken,
} from '../lib/session.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const authRouter = Router();

// Brute-force protection: 10 failed attempts per IP every 15 minutes.
// Successful logins are not counted.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'too_many_attempts' },
});

// No minimum length on login: the rule applies when a password is created, not when it is checked.
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

authRouter.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await prisma.admin.findUnique({ where: { email } });
  // Always run one hash verification, even for an unknown email (see getDummyHash).
  const valid = await verifyPassword(admin?.passwordHash ?? (await getDummyHash()), password);

  if (!admin || !valid) {
    res.status(401).json({ error: 'invalid_credentials' });
    return;
  }

  res.cookie(SESSION_COOKIE, signSessionToken(admin.id), {
    ...sessionCookieOptions,
    maxAge: sessionMaxAgeMs,
  });
  res.json({ id: admin.id, email: admin.email });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
  res.status(204).end();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json(req.admin);
});
