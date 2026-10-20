import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/requireAuth.js';
import { adminsRouter } from './routes/admins.js';
import { authRouter } from './routes/auth.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  // Strict CORS: only the public site may call the API, and it may send the session cookie.
  app.use(
    cors({
      origin: env.PUBLIC_SITE_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);

  // Every admin route requires a logged-in admin.
  // /api/admin/* is where the admin content routes (events, clubs, partners) will live.
  app.use('/api/admin', requireAuth);
  app.use('/api/admins', requireAuth, adminsRouter);

  app.use(errorHandler);

  return app;
}
