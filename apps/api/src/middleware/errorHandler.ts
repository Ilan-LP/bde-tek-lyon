import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

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

  console.error(err);
  res.status(500).json({ error: 'internal_error' });
};
