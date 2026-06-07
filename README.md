# GYRsite

GYR's main marketing site **and** its built-in CMS, in one Next.js app.

**Stack:** Next.js (App Router, TypeScript, `src/`) · Postgres + Prisma · Auth.js v5 (credentials) · Tailwind CSS v4 + hand-rolled shadcn-style UI · Tiptap rich-text editor.

## Local development

1. `pnpm install`
2. Make sure Postgres is running on `localhost:5432` and a `gyrsite` database exists. Then copy env and set values:
   - `cp .env.example .env`
   - Set `DATABASE_URL` to your Postgres connection string.
   - Set `AUTH_SECRET` (generate with `pnpm dlx auth secret`).
   - Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
3. `pnpm prisma migrate dev` — create the schema.
4. `pnpm db:seed` — create the first admin user.
5. `pnpm dev`

- Public site: http://localhost:3000
- CMS: http://localhost:3000/admin (log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`)

## Content model

- **Posts** — blog articles (Tiptap body, cover image, tags, author, draft/published).
- **Pages** — published **dynamically**: a `[...slug]` catch-all renders any published `Page` from the database, so new pages go live without a redeploy. `blog`, `team`, `admin`, `api` are reserved slugs.
- **Team members** — name, role, bio, photo, socials.
- **Media** — local-disk uploads under `public/uploads`, one `Media` row per file.

## Architecture notes

- Two surfaces, one app: public `src/app/(site)/` and auth-gated `src/app/admin/`.
- `middleware.ts` + `src/auth.config.ts` are edge-safe; `src/auth.ts` holds the Credentials provider (bcrypt) that runs in the Node runtime.
- Media storage is abstracted in `src/server/storage.ts` — swap the body for S3/R2 in production; nothing else changes.
- Server logic lives in `src/server/`, pure helpers in `src/lib/`, so a test harness (deferred for v1) can be added without refactoring.

## Setup notes

- **Prisma 7 driver adapter.** This project uses Prisma 7, where the datasource URL lives in `prisma.config.ts` (not the schema) and `PrismaClient` is constructed with a `@prisma/adapter-pg` adapter over the `pg` driver (see `src/db/prisma.ts`). No separate query-engine binary is downloaded.
- **Database password required.** The `DATABASE_URL` in `.env` must point at your running Postgres with valid credentials. Once set, run `pnpm prisma migrate dev --name init` (creates the `gyrsite` database + schema) then `pnpm db:seed`.
- **`@prisma/client` from the registry.** Installed as a normal registry dependency pinned to `7.8.0`. After any `schema.prisma` change, run `pnpm db:generate`.

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm db:migrate` — `prisma migrate dev`
- `pnpm db:generate` — `prisma generate`
- `pnpm db:seed` — seed the admin user
