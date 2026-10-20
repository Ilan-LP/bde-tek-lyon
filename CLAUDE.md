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
│   │   ├── Dockerfile             API image (multi-stage); docker-entrypoint.sh runs migrate deploy, then the server
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
│       ├── Dockerfile             Web image: Vite build served by nginx-unprivileged; nginx.conf next to it
│       ├── nginx.dev-proxy.conf   Local only: proxies /api and /uploads to the api (mounted by docker-compose.dev.yml)
│       ├── public/                Static files: brand fonts, favicons
│       └── src/
│           ├── main.tsx           Entry point (BrowserRouter)
│           ├── App.tsx            Route table (all pages inside the shared Layout)
│           ├── index.css          Tailwind import, @font-face and brand tokens (@theme)
│           ├── assets/            Logos imported by components (wave logo, jellyfish watermark)
│           ├── components/        Layout, Header, Footer, PageBackground, Button, Card, SectionTitle,
│           │                      DataView (loading/error/empty), EventCard, LogoBadge, Placeholder
│           │   └── admin/         Admin panel pieces: AdminRoot, RequireAdmin (guard), AdminLayout (sidebar),
│           │                      ResourceList (shared list table), form fields, ImageField, ConfirmDialog...
│           ├── content/site.ts    Editable texts: mission, bureau members, legal details
│           ├── lib/               api client, useApi, usePageMeta (title/OG tags), config (VITE_ env), format, mailto,
│           │                      admin: auth (login state), useAdminForm, adminValidation, datetime (Paris time)
│           └── pages/             One file per page (pages/admin/ holds the admin panel, loaded lazily)
├── brand/                    Brand assets and visual identity (see brand/visual_identity.md)
├── docker-compose.yml        Production stack: db, api, web (see "Docker")
├── docker-compose.dev.yml    Local override: host ports
├── .dockerignore             Keeps node_modules, .env*, uploads, brand/ out of the images
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
pnpm dev:web        # Vite dev server (http://localhost:5173)
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

## Web: pages and conventions

- Routes (French URLs): `/` Accueil, `/evenements` (+ `/evenements/:slug`), `/clubs`, `/partenaires`, `/a-propos`, `/mentions-legales`, `*` 404.
  All pages share `Layout` (background, header, footer). Each page calls `usePageMeta` for its title, description and Open Graph tags.
- Data comes from the public API through `lib/api.ts` + `useApi`. Wrap every API-backed section in `DataView`: it handles loading, error (with retry) and empty states.
- Design follows `brand/visual_identity.md` and lives in tokens/components, not in pages: colors, fonts, tracking and the logo shadow are in the `@theme` block of `index.css`;
  use `Button`, `Card`, `SectionTitle`, `PageBackground`. Outline (4px Main Blue) instead of heavy fills, off-white instead of white, 2-3 palette colors per section.
- Config: the web app reads `VITE_API_URL`, `VITE_CLUB_EMAIL`, `VITE_PARTNERSHIP_EMAIL` from the **root** `.env` (`envDir` in `vite.config.ts`; only `VITE_` variables reach the browser).
  The "Créer ton club" and "Devenir partenaire" buttons are `mailto:` links with a prefilled French subject and body. If an email is not set, a visible placeholder is shown.
- Missing information is written `À COMPLÉTER` (component `Placeholder`). Search for it before going live: `content/site.ts` and the pages.
- Event times are displayed in the Europe/Paris time zone. Social crawlers that do not run JavaScript only see the default tags of `index.html`.

## Web: admin panel

- Routes under `/admin` (French section URLs, never linked from the public site, `noindex` meta tag added by `AdminRoot`):
  `/admin/login`, `/admin` (dashboard: counts), `/admin/evenements`, `/admin/clubs`, `/admin/partenaires` (each with `/nouveau` and `/:id` for the form), `/admin/admins`.
  `App.tsx` loads them lazily (`/admin/*` -> `pages/admin/AdminRoutes.tsx`), so the public bundle does not contain admin code.
  At deployment also send an `X-Robots-Tag: noindex` header for `/admin` (the meta tag is ignored by crawlers that do not run JavaScript).
- Login state: `lib/auth.tsx` (`AuthProvider` around the admin area only) asks `GET /api/auth/me` once; the session itself is the httpOnly cookie, JavaScript never sees it.
  `RequireAdmin` redirects to `/admin/login` when nobody is logged in and brings the user back afterwards. Any admin call answered 401 (expired session) also logs the UI out
  (`setUnauthorizedHandler` in `lib/api.ts`). Admin calls need `credentials: 'include'` (`apiRequest(..., { credentials: true })`, `useApi(path, { admin: true })`).
- Events, clubs and partners share the same screens: `ResourceList` (table, published badge, publish toggle, delete with `ConfirmDialog`) and one form page each
  (`Admin<Resource>FormPage`) built from `TextField`, `CheckboxField`, `ImageField` and `FormShell`. To add a field: update the form page, `lib/types.ts` and the API schema.
- Forms: `useAdminForm` validates on submit, then live while the user fixes fields, and maps the API error codes to French (`errorMessage` in `lib/api.ts`).
  `lib/adminValidation.ts` mirrors the API rules (lengths, http(s) links, e-mail, password >= 12) without a validation library: **the API stays the authority**, keep both in sync.
- Images: `ImageField` uploads right away to `POST /api/admin/upload` and stores the returned URL; the form saves that URL like any other field.
- Event dates: the form uses `<input type="datetime-local">` interpreted as **Europe/Paris** time (`lib/datetime.ts`) and sends ISO instants to the API.
- The admin API has no "get one" route: edit pages load the list and pick the item by id (`ItemLoader`).

## Docker

Production runs as three containers (compose project `bde-site`): `db` (PostgreSQL 17), `api` (Express) and `web` (nginx serving the Vite build).
Images are built from the **repo root** (the pnpm lockfile lives there), base images are pinned to exact versions, and `api`/`web` run as non-root users.
`web` is nginx instead of static files served by the API because it caches and compresses efficiently, runs unprivileged, and keeps the API a pure JSON service.

```bash
cp .env.example .env     # fill in POSTGRES_*, JWT_SECRET, ADMIN_*, PUBLIC_*, emails (never commit it)

# Local run (Mac): site on http://localhost:8080 or http://127.0.0.1:8080 (both work), API on :3000, db on 127.0.0.1:5432
pnpm docker:dev          # builds and starts the stack
pnpm docker:dev:down     # stops it (data kept); add -v to the underlying command to also delete the database and uploads
# or: put COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml in your local .env, then a plain `docker compose up --build -d` is also on localhost

# Production (the server): the base file only
docker compose up -d --build
docker compose config -q # validates the file and the .env values
```

Rules (the host also runs other projects behind a shared Caddy and a backup script):

- The database service **must stay named `db`**: `/opt/proxy/backup.sh` finds PostgreSQL by that name. Container names are prefixed `bde-site-` to avoid clashes.
- The stack only has one private network, `internal` (the `edge` network was removed on purpose). **Nothing in the compose files connects the shared Caddy to `api` and `web`**:
  the deployment must do it (for example attach Caddy to `bde-site_internal`, or re-add an external network to `api` and `web`). Caddy would then target `bde-site-web:8080` and `bde-site-api:3000`,
  routing `/api/*` and `/uploads/*` to the api and everything else to the web.
- Locally the site and the API share **one origin**, like behind the production reverse proxy: the dev override builds the web with an empty `VITE_API_URL` and mounts `apps/web/nginx.dev-proxy.conf`,
  so nginx relays `/api` and `/uploads` to the api. The browser never calls port 3000, which is why `localhost` and `127.0.0.1` both work (the API's CORS allows a single origin).
  If something else already listens on port 3000 (for example `pnpm dev:api`), it no longer interferes with the Docker site, but stop it anyway to avoid confusion.
- **No ports are published in production** and there is no Caddy service here. Ports are only published by `docker-compose.dev.yml` (127.0.0.1), never copy that file to the server.
- Startup order: `db` healthy -> `api` runs `prisma migrate deploy`, creates the first admin if the table is empty (done by the app, not the entrypoint), then listens -> health checks on all services.
- Data lives in named volumes: `db_data` (PostgreSQL) and `uploads` (mounted on `/data/uploads`, the container's `UPLOAD_DIR`). Do not delete them with `down -v` on the server.
- Compose reads the same root `.env` as `pnpm dev`. It builds the container `DATABASE_URL` from `POSTGRES_*` and forces `UPLOAD_DIR=/data/uploads`, so the host-side values of those two lines are ignored.
- `VITE_*` values are **build arguments**: they are baked into the JavaScript, so changing one requires `docker compose build web`. `VITE_API_URL` empty = same origin (recommended in production).
- Never put secrets in the images or in committed files. `.dockerignore` excludes `.env*`; `VITE_*` values are public by nature.
- The `prisma` CLI is a production dependency of the api (the container runs `migrate deploy` itself). Keep it pinned to the same version as `@prisma/client`.

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
