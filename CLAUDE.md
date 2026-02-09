# DZIKA — Premium Music Showcase Website

## Quick Reference

- **Stack**: Next.js 15 (App Router) + Prisma 6 + PostgreSQL + NextAuth.js + Tailwind 4 + shadcn/ui
- **Node**: v22 (via nvm — always prefix commands with nvm load: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`)
- **Dev server**: `npm run dev` (Turbopack)
- **Database**: Docker Compose PostgreSQL 16 (`docker compose up -d`)
- **Prisma**: `npx prisma generate` / `npx prisma migrate dev` / `npx prisma db seed`

## Architecture

### Directory Structure
```
src/
  app/                    # Next.js App Router
    (public)/             # Public pages (navbar + footer layout)
      artist/             # Artist presentation page
      themes/             # Theme listing + [slug] detail
      tracks/             # Track detail [slug]
    admin/                # Admin panel (sidebar layout, protected by middleware)
      tracks/             # CRUD tracks + versions
      themes/             # CRUD themes with style editor
      comments/           # Comment moderation
      content/            # Site content editor
      stats/              # Analytics dashboard
    api/                  # API route handlers
      auth/[...nextauth]/ # NextAuth endpoints
      tracks/             # Track CRUD + play/download events
      themes/             # Theme CRUD
      comments/           # Comment moderation
      content/            # Site content
      stats/              # Statistics aggregation
      upload/             # Vercel Blob upload token
  components/
    ui/                   # shadcn/ui components (auto-generated, don't edit)
    layout/               # navbar, footer, admin-sidebar
    audio/                # audio-player, provider, controls
    track/                # track-card, track-detail
    theme/                # theme-provider, theme-card, style-editor
    comment/              # comment-list, form, star-rating
    admin/                # admin-specific components
    home/                 # homepage sections
  lib/                    # Utilities & config
    prisma.ts             # Prisma client singleton
    auth.ts               # Auth.js config with credentials provider
    auth.config.ts        # Auth config (used by middleware)
    utils.ts              # cn(), formatDuration(), slugify()
    validations.ts        # Zod schemas for all API inputs
    constants.ts          # Font list, animation types, file limits
    blob.ts               # Vercel Blob helpers
    rate-limit.ts         # IP-based rate limiter for comments
  hooks/                  # Custom React hooks
  types/                  # TypeScript types
    theme-styles.ts       # ThemeStyles interface + AnimationType
    index.ts              # Shared types
  actions/                # Server actions for form mutations
```

### Database Models (Prisma)
- **User** — admin authentication (email/passwordHash)
- **Theme** — music categories with JSON `styles` field for visual configuration
- **Track** — music entries linked to a theme, with denormalized play/download counts
- **TrackVersion** — multiple audio versions per track (V1, VHard, etc.)
- **Comment** — anonymous comments with optional star rating, self-referencing for admin replies
- **TrackEvent** — play/download analytics events
- **SiteContent** — key-value CMS for editable site content

### Key Patterns

**Dynamic Theming**: Theme `styles` JSON → CSS custom properties via `<ThemeProvider>` wrapper → components use `var(--theme-*)`. No runtime CSS generation.

**Audio Player**: Global `<AudioPlayerProvider>` context in root layout. Fixed bottom bar persists across navigation. Hidden `<audio>` element for playback.

**Auth**: NextAuth.js v5 with Credentials provider + JWT sessions. Middleware in `middleware.ts` protects all `/admin/*` routes except `/admin/login`.

**File Uploads**: Vercel Blob with client uploads for audio (signed token from `/api/upload/token`), server uploads for images.

**Comments**: Anonymous, rate-limited by IP hash. Admin replies stored as child comments with `isAdminReply: true`.

## Conventions

- Use server components by default. Add `"use client"` only when needed (interactivity, hooks, browser APIs).
- Use server actions (`src/actions/`) for admin form mutations. Use API routes for public reads and client-side event tracking.
- Validate all inputs with Zod schemas from `src/lib/validations.ts`.
- Use `cn()` from `src/lib/utils.ts` for conditional className merging.
- Import shadcn components from `@/components/ui/`.
- Keep admin pages in `/admin/`, public pages in `/(public)/`.
- All CSS variables prefixed with `--theme-`.
- Animation classes prefixed with `animate-` in `globals.css`.

## Environment Variables
See `.env.example` for all required variables. Key ones:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` / `NEXTAUTH_SECRET` — Auth.js secret
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — seed script credentials
