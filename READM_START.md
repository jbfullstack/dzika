# REMOVE ALL

docker-compose down -v

# START INFRA

docker-compose up -d

npx prisma migrate dev

## If seed needed

npx prisma db seed

# START APP
npm run dev


# TESTER DEPLOIEMENT PROD

docker-compose --profile prod up -d --build

  Ça va :
  1. Démarrer PostgreSQL
  2. Builder l'image Docker de l'app (le next build qui crashait avant)
  3. Lancer l'app + Caddy

  Si le build passe, c'est bon. Vous pouvez vérifier sur http://localhost:3000 (ou http://localhost:80 via Caddy).

  Pour revenir au mode dev après :

  docker-compose --profile prod down
  docker-compose up -d
  npm run dev