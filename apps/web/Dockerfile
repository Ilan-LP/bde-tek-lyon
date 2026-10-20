# syntax=docker/dockerfile:1
# Build from the repo root (the pnpm lockfile lives there):
#   docker build -f apps/web/Dockerfile .

FROM node:24.22.0-bookworm-slim AS build
# The pnpm version comes from "packageManager" in the root package.json.
RUN corepack enable
WORKDIR /repo

# Frozen lockfile: the build installs exactly what is committed.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Vite bakes the VITE_ values into the JavaScript at build time, so they are build arguments:
# changing one means rebuilding the image. None of them is a secret (they end up in the browser).
# VITE_API_URL empty = same origin: the proxy serves /api and /uploads on the site's own domain.
ARG VITE_API_URL=""
ARG VITE_PARTNERSHIP_EMAIL=""
ARG VITE_CLUB_EMAIL=""
ENV VITE_API_URL=$VITE_API_URL \
    VITE_PARTNERSHIP_EMAIL=$VITE_PARTNERSHIP_EMAIL \
    VITE_CLUB_EMAIL=$VITE_CLUB_EMAIL

COPY tsconfig.base.json ./
COPY apps/web apps/web
RUN pnpm --filter @bde-wave/web build

# ---- runtime: static files behind nginx, as a non-root user (listens on 8080) ----
FROM nginxinc/nginx-unprivileged:1.28.2-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
