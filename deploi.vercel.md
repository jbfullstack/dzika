 ---
  Déploiement Dzika sur Vercel

  Pré-requis

  - Compte https://vercel.com
  - Repo Git poussé (GitHub/GitLab/Bitbucket)

  ---
  Step 1 — Push ton code sur GitHub

  git add -A
  git commit -m "feat: ready for production"
  git push origin main

  Le logo public/dzika-logo.png est dans le repo, il sera servi automatiquement par Vercel sur /dzika-logo.png.

  ---
  Step 2 — Créer le projet Vercel

  1. Va sur https://vercel.com/new
  2. Importe ton repo GitHub
  3. Framework Preset : il détectera "Next.js" automatiquement
  4. Ne clique pas encore sur Deploy — configure d'abord les services ci-dessous

  ---
  Step 3 — Ajouter Vercel Postgres

  1. Dans le dashboard Vercel, va dans Storage (menu du haut)
  2. Clique Create Database → Neon Serverless Postgres
  3. Choisis un nom (ex: dzika-db) et la région la plus proche de tes users
  4. Connecte-le à ton projet quand il te le propose
  5. Vercel va automatiquement injecter DATABASE_URL, POSTGRES_URL, etc. dans les env vars du projet

  Vérifie dans Settings → Environment Variables que DATABASE_URL commence par postgresql:// ou postgres://.

  ---
  Step 4 — Ajouter Vercel Blob

  1. Toujours dans Storage, clique Create → Blob
  2. Choisis un nom (ex: dzika-blob)
  3. Connecte-le au projet
  4. Vercel injecte automatiquement BLOB_READ_WRITE_TOKEN

  ---
  Step 5 — Configurer les variables d'environnement

  Va dans Settings → Environment Variables du projet et ajoute :
  ┌─────────────────┬──────────────────────────────────────────┐
  │    Variable     │                  Valeur                  │
  ├─────────────────┼──────────────────────────────────────────┤
  │ AUTH_SECRET     │ Génère avec : openssl rand -base64 32    │
  ├─────────────────┼──────────────────────────────────────────┤
  │ NEXTAUTH_SECRET │ Même valeur que AUTH_SECRET              │
  ├─────────────────┼──────────────────────────────────────────┤
  │ ADMIN_EMAIL     │ Ton email admin (ex: admin@dzika.com)    │
  ├─────────────────┼──────────────────────────────────────────┤
  │ ADMIN_PASSWORD  │ Un mot de passe fort pour le login admin │
  └─────────────────┴──────────────────────────────────────────┘
  DATABASE_URL et BLOB_READ_WRITE_TOKEN sont déjà là grâce aux étapes 3 et 4.
  NEXTAUTH_URL n'est pas nécessaire sur Vercel (détecté automatiquement).

  ---
  Step 6 — Configurer le build pour Prisma

  Il faut que Prisma génère le client au build. Va dans Settings → General → Build & Development Settings et set :
  ┌───────────────┬────────────────────────────────────────────────────────────────┐
  │     Champ     │                             Valeur                             │
  ├───────────────┼────────────────────────────────────────────────────────────────┤
  │ Build Command │ npx prisma generate && npx prisma migrate deploy && next build │
  └───────────────┴────────────────────────────────────────────────────────────────┘
  Cela va :
  1. Générer le client Prisma
  2. Appliquer toutes les migrations sur la DB Vercel
  3. Builder l'app Next.js

  ---
  Step 7 — Premier déploiement

  Clique Deploy (ou pousse un commit pour trigger un redeploy).

  Attends que le build passe. Si tout est vert, ton site est live.

  ---
  Step 8 — Jouer le seed

  Le seed ne tourne pas automatiquement au build. Tu dois le lancer manuellement une seule fois. Deux options :

  Option A — Via Vercel CLI (recommandé) :

  # Installe Vercel CLI si pas déjà fait
  npm i -g vercel

  # Link ton projet local à Vercel
  vercel link

  # Pull les env vars de production en local
  vercel env pull .env.production.local

  # Lance le seed avec les env vars de prod
  npx dotenv -e .env.production.local -- npx tsx prisma/seed.ts

  Option B — Plus simple, sans dotenv :

  vercel link
  vercel env pull .env.production.local

  Puis copie la valeur de DATABASE_URL depuis .env.production.local et lance :

  DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts

  Remplace "postgresql://..." par la vraie URL copiée.

  Après le seed, tu devrais voir :
  Admin user created: admin@dzika.com
  Site content seeded: 14 entries
  Themes seeded: 4 themes

  ---
  Step 9 — Vérifier

  1. Site public : ouvre https://ton-projet.vercel.app — hero, thèmes, logo visible
  2. Admin : va sur /admin/login — connecte-toi avec ADMIN_EMAIL / ADMIN_PASSWORD
  3. Logo : /dzika-logo.png est servi directement depuis le dossier public/ (pas besoin de Blob pour celui-là)
  4. Blob : les uploads d'images/audio depuis l'admin utiliseront Vercel Blob automatiquement

  ---
  Récap des variables finales

  DATABASE_URL=        ← auto (Vercel Postgres)
  BLOB_READ_WRITE_TOKEN= ← auto (Vercel Blob)
  AUTH_SECRET=         ← toi (openssl rand -base64 32)
  NEXTAUTH_SECRET=     ← même valeur
  ADMIN_EMAIL=         ← toi
  ADMIN_PASSWORD=      ← toi