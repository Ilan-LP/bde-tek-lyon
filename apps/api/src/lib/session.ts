import type { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';

export const SESSION_COOKIE = 'bde_wave_session';

const SESSION_HOURS = 8;

// httpOnly: not readable from JavaScript (limits damage of an XSS).
// secure: only sent over HTTPS (browsers also allow it on http://localhost).
// sameSite=lax: not sent on cross-site POST/PATCH/DELETE requests (CSRF protection).
export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
};

// The token only carries the admin id (`sub`). Everything else is read from the database
// on each request, so a deleted admin loses access immediately.
export function signSessionToken(adminId: string) {
  return jwt.sign({}, env.JWT_SECRET, {
    algorithm: 'HS256',
    subject: adminId,
    expiresIn: `${SESSION_HOURS}h`,
  });
}

// Returns the admin id, or null if the token is missing, forged or expired.
export function readSessionToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    return typeof payload === 'object' && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}

export const sessionMaxAgeMs = SESSION_HOURS * 60 * 60 * 1000;
