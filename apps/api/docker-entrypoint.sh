#!/bin/sh
# Apply pending database migrations, then start the API.
# The first admin is created by the app itself at startup (src/bootstrap.ts): nothing to do here.
set -e

node_modules/.bin/prisma migrate deploy

# exec: node becomes PID 1 and receives docker stop's SIGTERM directly.
exec node dist/index.js
