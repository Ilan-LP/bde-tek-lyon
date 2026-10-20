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
| API      | Express 5, TypeScript, Prisma 7 (PostgreSQL), zod                           |
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
│   │   ├── prisma/schema.prisma   Database schema (no models yet)
│   │   ├── prisma.config.ts       Prisma 7 config (reads DATABASE_URL)
│   │   └── src/
│   │       ├── index.ts           Starts the server
│   │       ├── app.ts             Builds the Express app and its routes
│   │       ├── env.ts             zod validation of environment variables
│   │       └── generated/         Prisma client output (git-ignored)
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
pnpm format         # Prettier write (format:check to only verify)
```

Setup: copy `.env.example` to `.env` and fill in the values. `.env` is git-ignored and must never be committed.
The API currently validates only `PORT` (default 3000); other variables are validated by the task that starts using them.

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
