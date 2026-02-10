#!/bin/sh
set -e

echo "==> Running database migrations..."
npx prisma migrate deploy

echo "==> Seeding database (upsert — safe to re-run)..."
npx --yes tsx prisma/seed.ts || echo "    (seed skipped or already applied)"

echo "==> Starting app..."
exec "$@"
