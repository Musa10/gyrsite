# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package manager: pnpm only — never npm

This repo uses **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`, and a `.pnpm/` store under `node_modules`). **Do not run `npm install` / `npm ci`** — npm cannot reconcile pnpm's symlinked store and crashes with `Cannot read properties of null (reading 'matches')` (an arborist dedupe bug). Always use `pnpm add` / `pnpm add -D` / `pnpm install`. The `db:*` scripts say `prisma`/`tsx` but are run via `pnpm` (`pnpm db:migrate`, etc.).

## Commands

- `pnpm dev` — run the app (public site at `/`, CMS at `/admin`)
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint (`eslint-config-next`)
- `npx tsc --noEmit` — typecheck (the primary correctness gate; CI-style verification used throughout)
- `pnpm db:migrate` — `prisma migrate dev` (needs a reachable `DATABASE_URL`)
- `pnpm db:generate` — `prisma generate` (run after any `schema.prisma` change)
- `pnpm db:seed` — seed the admin user (`tsx prisma/seed.ts`)

There is **no broad test harness.** vitest is present only for isolated pure helpers. Run one test file with `npx vitest run <path>` (or `pnpm test` once a `test` script exists). Most verification is `npx tsc --noEmit` + `pnpm build` + manual checks via `pnpm dev`.

## Prisma 7 specifics (non-standard)

- **Driver adapter, no query engine binary.** `PrismaClient` is constructed with a `@prisma/adapter-pg` adapter over the `pg` driver in `src/db/prisma.ts` (singleton via `globalThis`). The datasource URL comes from `prisma.config.ts` / `DATABASE_URL`, **not** a `url` in `schema.prisma`.
- **`@prisma/client` is a normal registry dependency** pinned to `7.8.0` in `package.json`. After any `schema.prisma` change run `pnpm db:generate`.

## Architecture

**One Next.js App-Router app serves two surfaces:** the public marketing site (`src/app/(site)/`) and an auth-gated CMS (`src/app/admin/`). API routes live at `src/app/api/` and are never localized.

**Auth is split across two runtimes (Auth.js v5 / NextAuth beta):**
- `src/auth.config.ts` — **edge-safe** config: the `authorized` callback (gates everything under `/admin` except `/admin/login`), `jwt`/`session` callbacks (carry `id`/`role`), and `pages.signIn`. Consumed by `middleware.ts`.
- `src/auth.ts` — **Node-runtime** instance that adds the Credentials provider (bcrypt password compare against `User.passwordHash`). JWT session strategy. Exports `auth`/`signIn`/`signOut`/`handlers`.
- Keep Node-only deps (bcrypt, Prisma) out of `auth.config.ts`/`middleware.ts` — they must stay edge-safe.

**Content & rendering model (DB-driven, no redeploy to publish):**
- **Pages** render dynamically through the `(site)/[...slug]` catch-all: any `PUBLISHED` `Page` row becomes a live route. `blog`, `team`, `admin`, `api` are reserved slugs.
- **Posts/Pages bodies are Tiptap JSON** stored in `Json` columns (edited via `src/components/editor/rich-text-editor.tsx`).
- **Status enum** (`DRAFT`/`PUBLISHED`) gates public visibility; public queries filter on it.

**Layering (intentional, keep it):**
- `src/server/*` — server actions (`"use server"`) and data access. Mutations follow: `requireUser()` → zod-parse `FormData` → Prisma write → `revalidatePath(...)` → `redirect(...)`. Read queries for the public site live in `src/server/public-content.ts`.
- `src/lib/*` — pure helpers (`slugify`, schemas under `src/lib/schemas/`, tiptap utils) — no DB/React, so they're unit-testable in isolation.
- `src/components/{site,admin,editor,ui}` — `ui/` is hand-rolled shadcn-style primitives; `site/brand/` holds the falcon/logo SVGs.
- **Media** is uploaded to local disk under `public/uploads` (one `Media` row per file) via `src/server/storage.ts` — storage is abstracted there so it can be swapped for S3/R2 without touching callers.

**Path alias:** `@/*` → `src/*`.

## In-progress: i18n (EN/AR)

An incomplete internationalization effort is underway (branch `build/gyrsite-v1`). Foundation exists under `src/i18n/` (`routing.ts`, `navigation.ts`, `request.ts`), `messages/{en,ar}.json`, and `next.config.ts` is wrapped with `createNextIntlPlugin`. The full plan and design live in `docs/superpowers/plans/2026-06-05-i18n-ar-en.md` and `docs/superpowers/specs/2026-06-05-i18n-ar-en-design.md`. Target architecture: routes move under `src/app/[locale]/`, `middleware.ts` composes next-intl with the Auth.js middleware, CMS models gain nullable `*Ar` sibling columns resolved by a `pickLocalized()` helper with English fallback. Consult those docs before extending i18n.
