import type { RequestHandler } from 'express';
import { prisma } from '../db.js';
import { readSessionToken, SESSION_COOKIE } from '../lib/session.js';

// Lets the request through only if the session cookie holds a valid token
// of an admin that still exists. Sets `req.admin`.
export const requireAuth: RequestHandler = async (req, res, next) => {
  const token: unknown = req.cookies?.[SESSION_COOKIE];
  const adminId = typeof token === 'string' ? readSessionToken(token) : null;
  const admin = adminId
    ? await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true, email: true } })
    : null;

  if (!admin) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  req.admin = admin;
  next();
};
