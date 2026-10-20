import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/requireAuth.js';
import { adminsRouter } from './routes/admins.js';
import { authRouter } from './routes/auth.js';
import { adminClubsRouter, publicClubsRouter } from './routes/clubs.js';
import { adminEventsRouter, publicEventsRouter } from './routes/events.js';
import { adminPartnersRouter, publicPartnersRouter } from './routes/partners.js';
import { uploadRouter } from './routes/upload.js';

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

  // Uploaded images, served as plain static files.
  app.use(
    '/uploads',
    express.static(env.UPLOAD_DIR, {
      index: false, // no directory listing
      redirect: false,
      dotfiles: 'ignore',
      immutable: true, // file names are random and never reused
      maxAge: '1y',
      setHeaders(res) {
        // The site (another origin) must be allowed to display these images.
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        // Never let the browser guess a type, and never run anything if a file is opened directly.
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
      },
    }),
  );

  app.use('/api/auth', authRouter);

  // Public routes: no login, published items only.
  app.use('/api/events', publicEventsRouter);
  app.use('/api/clubs', publicClubsRouter);
  app.use('/api/partners', publicPartnersRouter);

  // Every admin route requires a logged-in admin.
  // Registered before the routers below, so an unknown /api/admin/* path also answers 401.
  app.use('/api/admin', requireAuth);
  app.use('/api/admin/events', adminEventsRouter);
  app.use('/api/admin/clubs', adminClubsRouter);
  app.use('/api/admin/partners', adminPartnersRouter);
  app.use('/api/admin/upload', uploadRouter);
  app.use('/api/admins', requireAuth, adminsRouter);

  // Unknown path: answer in JSON like every other error (Express would send an HTML page).
  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  app.use(errorHandler);

  return app;
}
