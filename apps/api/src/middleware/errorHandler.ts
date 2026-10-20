import type { ErrorRequestHandler } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client.js';

// Routes call `schema.parse(...)` and let it throw: invalid input ends up here as a 400.
// Express 5 forwards errors from async handlers automatically.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'validation_error',
      issues: err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
    return;
  }

  // Thrown by express.json() on a malformed body.
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'invalid_json' });
    return;
  }

  // Thrown by multer (file upload parsing).
  if (err instanceof multer.MulterError) {
    const code = err.code === 'LIMIT_FILE_SIZE' ? 'file_too_large' : 'invalid_upload';
    res.status(400).json({ error: code });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: update/delete/findUniqueOrThrow found no row.
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    // P2002: unique constraint violated (e.g. two identical slugs created at the same moment).
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'conflict' });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ error: 'internal_error' });
};
