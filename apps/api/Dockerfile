# syntax=docker/dockerfile:1
# Build from the repo root (the pnpm lockfile lives there):
#   docker build -f apps/api/Dockerfile .

# openssl: needed by the Prisma schema engine that runs the migrations.
FROM node:24.22.0-bookworm-slim AS base
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
# The pnpm version comes from "packageManager" in the root package.json.
RUN corepack enable
WORKDIR /repo

# ---- deps: install the whole workspace from the lockfile (frozen: no surprise upgrades) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---- build: generate the Prisma client, then compile TypeScript to apps/api/dist ----
FROM deps AS build
COPY tsconfig.base.json ./
COPY apps/api apps/api
RUN pnpm --filter @bde-wave/api build

# ---- prod-deps: a standalone node_modules with production dependencies only ----
# --legacy: pnpm 10+ refuses a plain deploy unless workspace packages are "injected"; the API
# does not depend on any other workspace package, so the legacy mode is all we need.
FROM deps AS prod-deps
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm --filter @bde-wave/api deploy --legacy --prod /prod

# ---- runtime ----
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    UPLOAD_DIR=/data/uploads \
    PRISMA_HIDE_UPDATE_MESSAGE=1 \
    CHECKPOINT_DISABLE=1
WORKDIR /app

COPY --from=prod-deps /prod/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./dist
# The Prisma CLI needs prisma/ and prisma.config.ts to run `migrate deploy`.
# package.json is required at run time too: its "type": "module" makes dist/*.js load as ESM.
COPY --from=build /repo/apps/api/prisma ./prisma
COPY --from=build /repo/apps/api/prisma.config.ts ./
COPY --from=build /repo/apps/api/package.json ./
COPY --chmod=755 apps/api/docker-entrypoint.sh ./

# The upload folder exists and belongs to the non-root user, so a fresh named volume mounted
# on it inherits that ownership.
RUN mkdir -p /data/uploads && chown -R node:node /data/uploads
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

ENTRYPOINT ["./docker-entrypoint.sh"]
