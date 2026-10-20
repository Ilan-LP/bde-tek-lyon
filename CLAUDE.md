# BDE Wave – Epitech Lyon

## Purpose

Showcase website with an admin panel for **BDE Wave**, the student association (BDE) of Epitech Lyon.
It is a small project: **one React frontend, one Express backend, one PostgreSQL database. Nothing more.**
Do not add microservices, extra frontends, queues, caches or any infrastructure beyond that.

The project owner must understand exactly what is done (school policy), so every change stays small and is explained.

## Stack

| Part     | Tools                                                                       |
| -------- | --------------------------------------------------------------------------- |
| Monorepo | pnpm workspaces (Node >= 22)                                                |
| API      | Express 5, TypeScript, Prisma 7 (PostgreSQL), zod, argon2, JWT in cookie    |
| Web      | React 19, Vite, TypeScript, Tailwind CSS 4, react-router (declarative mode) |
| Quality  | ESLint 10 (flat config, typescript-eslint) + Prettier, shared at the root   |

Version constraints worth knowing:

- TypeScript is pinned to `~6.0` because typescript-eslint does not support TypeScript 7 yet.
- `prisma` (CLI) and `@prisma/client` are pinned to the exact same version. Keep them aligned.
- pnpm 11 blocks dependency install scripts by default. The allowed ones are listed in `pnpm-workspace.yaml` (`allowBuilds`).

## Folder structure

```
.
├── apps/
│   ├── api/                  Express + Prisma backend (@bde-wave/api)
│   │   ├── prisma/schema.prisma   Database schema: Admin, Event, Club, Partner
│   │   ├── prisma/migrations/     SQL migrations (committed)
│   │   ├── prisma.config.ts       Prisma 7 config (loads the root .env, reads DATABASE_URL)
│   │   └── src/
│   │       ├── index.ts           Creates the first admin, then starts the server
│   │       ├── app.ts             Express app: helmet, CORS, routes, auth guards
│   │       ├── env.ts             zod validation of environment variables
│   │       ├── db.ts              Prisma client (pg driver adapter)
│   │       ├── bootstrap.ts       First admin from ADMIN_EMAIL / ADMIN_PASSWORD
│   │       ├── lib/               password (argon2), session (JWT + cookie), slug, imageType, shared zod schemas
│   │       ├── middleware/        requireAuth, errorHandler
│   │       ├── routes/            auth, admins, events, clubs, partners (public + admin routers each), upload
│   │       └── generated/         Prisma client output (git-ignored)
│   │   └── uploads/               Default UPLOAD_DIR: uploaded images (git-ignored)
│   └── web/                  React frontend (@bde-wave/web)
│       ├── public/                Static files: brand fonts, logo, favicons
│       └── src/
│           ├── main.tsx           Entry point (BrowserRouter)
│           ├── App.tsx            Route table
│           ├── index.css          Tailwind import + brand tokens (@theme)
│           └── pages/             One file per page
├── brand/                    Brand assets and visual identity (see brand/visual_identity.md)
├── eslint.config.mjs         Shared ESLint config for the whole repo
├── .prettierrc.json          Shared Prettier config
├── tsconfig.base.json        Shared TypeScript options, extended by each app
├── pnpm-workspace.yaml       Workspace definition + allowed build scripts
└── .env.example              Template of all environment variables
```

## Commands

```bash
pnpm install        # install everything
pnpm dev:api        # API with auto-reload (reads ./.env if present)
pnpm dev:web        # Vite dev server
pnpm build          # build all apps (the API build also runs `prisma generate`)
pnpm lint           # ESLint on all apps
pnpm --filter @bde-wave/api db:migrate   # create/apply a migration in development
pnpm --filter @bde-wave/api db:deploy    # apply existing migrations (production)
pnpm format         # Prettier write (format:check to only verify)
```

Setup: copy `.env.example` to `.env`, fill in the values, and start a PostgreSQL database matching `DATABASE_URL`
(e.g. `docker run -d -e POSTGRES_PASSWORD=... -e POSTGRES_DB=bde_wave -p 127.0.0.1:5432:5432 postgres:17-alpine`),
then run `pnpm --filter @bde-wave/api db:migrate`. `.env` is git-ignored and must never be committed.
The API validates `PORT`, `DATABASE_URL`, `JWT_SECRET` (>= 32 chars), `ADMIN_EMAIL`, `ADMIN_PASSWORD` (>= 12 chars),
`PUBLIC_SITE_URL`, `PUBLIC_API_URL` (default `http://localhost:<PORT>`) and `UPLOAD_DIR` (default `./uploads`) at startup and refuses to start if one is invalid. `PARTNERSHIP_EMAIL` and `CLUB_EMAIL`
are validated by the task that starts using them.

## API: auth and admins

- Login: `POST /api/auth/login` sets a JWT (8 h) in an `httpOnly`, `secure`, `sameSite=lax` cookie. Passwords are hashed with argon2id.
  Failed logins are rate limited (10 per 15 min per IP). `POST /api/auth/logout`, `GET /api/auth/me`.
- `requireAuth` checks the cookie **and** that the admin still exists in the database, so deleting an admin cuts their access at once.
  It guards `/api/admins` and everything under `/api/admin/*` (put future admin content routes there).
- Admin management: `GET/POST /api/admins`, `DELETE /api/admins/:id`, `PATCH /api/admins/me/password`.
  Safety rules: an admin cannot delete themself, and the last remaining admin can never be deleted
  (checked in a SERIALIZABLE transaction so two simultaneous deletions cannot leave zero admins).
- First admin: at startup, if the Admin table is empty, one admin is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD`; otherwise nothing happens.
- No roles, no permissions, no audit log: every admin can do everything.
- Errors are JSON with a stable English code (`{ "error": "invalid_credentials" }`). The frontend maps codes to French text.
- CORS only allows `PUBLIC_SITE_URL`. If the API runs behind a reverse proxy, set Express `trust proxy` so the rate limit sees real client IPs.

## API: content (events, clubs, partners) and uploads

- **Public routes** (no auth, `published: true` only, no `published`/timestamp fields in the answer):
  `GET /api/events` (upcoming and ongoing, soonest first; `?past=true` for past events, latest first), `GET /api/events/:slug`,
  `GET /api/clubs`, `GET /api/clubs/:slug`, `GET /api/partners`. Partners have no slug and no detail route.
- **Admin routes** (behind `requireAuth`, include unpublished items): for each of `/api/admin/events`, `/api/admin/clubs`,
  `/api/admin/partners`: `GET /` (all), `POST /`, `PATCH /:id` (partial update), `DELETE /:id` (204).
  Send `null` to clear an optional field. Unknown fields are rejected (strict zod schemas). Each resource lives in one file in
  `routes/` exporting a public and an admin router.
- **Slugs** (events, clubs) are generated from the title/name when created (`lib/slug.ts`: accents removed, `-2`, `-3`... if taken)
  and **never change afterwards**, so public links stay valid when a title is edited.
- **Upload**: `POST /api/admin/upload`, `multipart/form-data`, one file in the field `image`, jpeg/png/webp only, max 2 MB.
  The real type is read from the file's first bytes (`lib/imageType.ts`), never from its name or Content-Type. SVG is refused (it can contain scripts).
  The file is saved as `<random uuid>.<ext>` in `UPLOAD_DIR` and the answer is `{ "url": "<PUBLIC_API_URL>/uploads/<name>" }`.
  Use that URL in `imageUrl` / `logoUrl`. Files are served under `/uploads` with `nosniff`, a locked-down CSP and no directory listing.
  Deleting an item does not delete its image file. In production, `UPLOAD_DIR` must be a persistent volume.
- Link fields (`imageUrl`, `logoUrl`, `websiteUrl`, `registrationUrl`) only accept `http(s)` URLs.
- Extra error codes: `validation_error` (400, with `issues`), `file_missing` / `file_too_large` / `unsupported_file_type` / `invalid_upload` (400),
  `not_found` (404), `conflict` (409, unique constraint hit by a race). Unknown paths also answer `404 not_found` in JSON.

## Rules

- **Language**: code, comments, commits and docs are in English. All user-facing website text is in **French**, with correct accents (é, è, ê, à, ç, œ...) written in native UTF-8, never escaped (no `&eacute;`, no `é`).
- **Brand**: colors, fonts and layout style follow `brand/visual_identity.md` (Gagalin for display text, Bebas Neue for body, off-white `#e8e8e8` instead of pure white).
- **Scope**: no new service, app or infrastructure. Keep it one frontend, one backend, one database.
- **Secrets**: never commit `.env` or real credentials. Add every new variable to `.env.example`.
- **Validation**: validate all external input (request bodies, params, env) with zod.

## Working conventions

- Small, scoped tasks only. Read the relevant context first, plan before acting, stay in scope.
- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`...).
- Never add a dependency without saying why.
- At the end of each task, give a summary of exactly what changed, and update this file if the structure or a decision changed.
