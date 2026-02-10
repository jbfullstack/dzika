#!/bin/bash
set -e

echo ""
echo "  ╔══════════════════════════════════╗"
echo "  ║     DZIKA — Deploy Script        ║"
echo "  ╚══════════════════════════════════╝"
echo ""

# Check Docker is installed
if ! command -v docker &> /dev/null; then
  echo "ERROR: Docker is not installed."
  echo "Install it: https://docs.docker.com/engine/install/"
  exit 1
fi

# Detect compose command (V2 plugin vs V1 standalone)
if docker compose version &> /dev/null; then
  COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
  COMPOSE="docker-compose"
else
  echo "ERROR: docker compose is not available."
  echo "Install it: https://docs.docker.com/compose/install/"
  exit 1
fi

# Check .env exists
if [ ! -f .env ]; then
  echo "ERROR: .env file not found."
  echo ""
  echo "Create it from the template:"
  echo "  cp .env.production.example .env"
  echo "  nano .env"
  echo ""
  exit 1
fi

# Build & start everything
echo "==> Building and starting services..."
$COMPOSE --profile prod up -d --build

echo ""
echo "==> Waiting for the app to be ready..."
sleep 5

echo ""
echo "  ✓ PostgreSQL running"
echo "  ✓ Migrations applied"
echo "  ✓ Database seeded"
echo "  ✓ App running on port 3000"
echo "  ✓ Caddy reverse proxy on ports 80/443"
echo ""
echo "  Your site is live!"
echo ""
echo "  Logs:     $COMPOSE logs -f app"
echo "  Stop:     $COMPOSE down"
echo "  Restart:  $COMPOSE restart app"
echo ""
