Déploiement self-hosted — Guide pour ton ami

  Pré-requis (une seule fois)

  Installer Docker sur sa machine Linux :

  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  # se reconnecter pour que le groupe prenne effet

  Récupérer le projet

  Via Syncthing/FTP comme d'habitude — le dossier entier du projet.

  Configurer (une seule fois)

  cd /chemin/vers/dzika
  cp .env.production.example .env
  nano .env

  Remplir les 5 valeurs :
  ┌───────────────────────┬────────────────────────────────────────────────────────┐
  │       Variable        │                      Quoi mettre                       │
  ├───────────────────────┼────────────────────────────────────────────────────────┤
  │ DOMAIN                │ Son domaine (ex: dzika.music) ou localhost pour tester │
  ├───────────────────────┼────────────────────────────────────────────────────────┤
  │ DB_PASSWORD           │ Un mot de passe fort au choix                          │
  ├───────────────────────┼────────────────────────────────────────────────────────┤
  │ AUTH_SECRET           │ Générer avec openssl rand -base64 32                   │
  ├───────────────────────┼────────────────────────────────────────────────────────┤
  │ ADMIN_EMAIL           │ Email pour se connecter à /admin                       │
  ├───────────────────────┼────────────────────────────────────────────────────────┤
  │ ADMIN_PASSWORD        │ Mot de passe admin                                     │
  ├───────────────────────┼────────────────────────────────────────────────────────┤
  │ BLOB_READ_WRITE_TOKEN │ Token Vercel Blob (voir ci-dessous)                    │
  └───────────────────────┴────────────────────────────────────────────────────────┘
  Déployer — 1 commande

  ./deploy.sh

  C'est tout. Le script :
  1. Build l'image Docker de l'app
  2. Lance PostgreSQL
  3. Applique les migrations
  4. Seed la base (admin, contenus, thèmes)
  5. Lance l'app sur le port 3000
  6. Lance Caddy en reverse proxy (ports 80 + 443 avec HTTPS automatique)

  Mettre à jour après un changement

  Quand tu lui envoies une nouvelle version via Syncthing :

  docker compose up -d --build

  ---
  Vercel Blob (pour les uploads)

  Même sur un serveur self-hosted, Vercel Blob fonctionne — c'est une API cloud indépendante :

  1. Va sur https://vercel.com, crée un compte gratuit
  2. Dashboard → Storage → Create Blob Store
  3. Copie le BLOB_READ_WRITE_TOKEN
  4. Colle-le dans le .env du serveur

  ---
  Lier un nom de domaine

  1. Acheter un domaine (Namecheap, OVH, Cloudflare, etc.)
  2. Ajouter un enregistrement DNS chez le registrar :

  | Type | Nom | Valeur           |
  |------|-----|------------------|
  | A    | @   | IP fixe de l'ami |
  | A    | www | IP fixe de l'ami |

  3. Mettre le domaine dans .env :
  DOMAIN=dzika.music
  4. Redéployer :
  docker compose up -d --build

  Caddy détecte le domaine, contacte Let's Encrypt, et obtient un certificat HTTPS automatiquement. Pas de config nginx, pas de certbot, rien.

  Important : les ports 80 et 443 doivent être ouverts sur le routeur de l'ami (port forwarding vers sa machine).

  ---
  Commandes utiles

  docker compose logs -f app    # voir les logs en live
  docker compose restart app    # redémarrer l'app
  docker compose down            # tout arrêter
  docker compose up -d           # tout relancer