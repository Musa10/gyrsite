# GYRsite — Design Spec

**Date:** 2026-06-04
**Status:** Approved design, pending spec review

## Summary

GYRsite is the main marketing/content website for a tech company, with a
self-contained CMS built into the same Next.js application. Editors manage all
content (blog posts, dynamic pages, team members, media) from an authenticated
`/admin` dashboard backed by a Postgres database. Pages are published
**dynamically** — created and published in the CMS and rendered live via a
catch-all route, with no redeploy required.

## Goals

- A polished public site for a tech company (home, blog, team, plus arbitrary
  dynamically-created pages).
- A built-in CMS at `/admin` with CRUD for posts, pages, team members, and media.
- Dynamic page publishing: create a page in the CMS → it is live immediately.
- Own all data and auth; no third-party CMS or hosted auth dependency.

## Non-Goals (v1)

- No automated test setup yet (Vitest/Playwright deferred to a later iteration).
- No e-commerce / checkout.
- No cloud object storage in v1 (local disk uploads; storage is abstracted so
  S3/R2 can be added later).
- No multi-tenant / multi-site support.

## Stack

| Concern        | Choice                                            |
|----------------|---------------------------------------------------|
| Framework      | Next.js (App Router) + TypeScript, `src/` layout  |
| Database       | Postgres (local via Docker Compose for dev)       |
| ORM            | Prisma                                            |
| Auth           | Auth.js v5 (NextAuth), credentials provider, JWT  |
| Styling        | Tailwind CSS + shadcn/ui                          |
| Rich text      | Tiptap (stores HTML/JSON), rendered on public site|
| Package manager| pnpm                                              |

## Architecture

Two surfaces in one Next.js app:

```
src/
  app/
    (site)/                  ← public marketing site
      page.tsx               ← home
      blog/page.tsx          ← blog index
      blog/[slug]/page.tsx   ← single post
      team/page.tsx          ← team section
      [...slug]/page.tsx     ← DYNAMIC pages rendered from the Page table
    admin/                   ← the CMS (auth-gated via middleware)
      login/page.tsx
      page.tsx               ← dashboard
      posts/                 ← list + create/edit CRUD
      pages/                 ← list + create/edit CRUD
      team/                  ← list + create/edit CRUD
      media/                 ← upload + browse
    api/
      auth/[...nextauth]/    ← Auth.js handlers
      upload/                ← media upload endpoint
  components/                ← shared UI (shadcn/ui lives here)
  lib/                       ← utils: slugify, auth helpers, validation
  server/                    ← server-only logic: content queries, storage adapter
  db/                        ← Prisma client singleton
middleware.ts                ← protects /admin/*
prisma/
  schema.prisma
  seed.ts                    ← creates the first admin user
docker-compose.yml           ← local Postgres
```

### Dynamic page rendering

Instead of hardcoding routes for About/Services/etc., a `[...slug]` catch-all
route under `(site)` looks up a `Page` by its slug in the database. If the page
exists and `status = PUBLISHED`, it renders the page's Tiptap content; otherwise
it returns a 404. Creating and publishing a page in `/admin/pages` makes it live
immediately (revalidate the relevant path on save). Reserved slugs (`blog`,
`team`, `admin`, `api`) are excluded from the catch-all to avoid collisions.

## Data Model (Prisma)

```prisma
enum Role     { ADMIN EDITOR }
enum Status   { DRAFT PUBLISHED }

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(EDITOR)
  posts        Post[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Post {
  id           String    @id @default(cuid())
  title        String
  slug         String    @unique
  excerpt      String?
  body         Json      // Tiptap document (JSON), rendered to HTML on read
  coverImage   Media?    @relation(fields: [coverImageId], references: [id])
  coverImageId String?
  author       User?     @relation(fields: [authorId], references: [id])
  authorId     String?
  tags         String[]
  status       Status    @default(DRAFT)
  publishedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Page {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  body        Json      // Tiptap document
  status      Status    @default(DRAFT)
  publishedAt DateTime?
  showInNav   Boolean   @default(false)
  navOrder    Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model TeamMember {
  id        String   @id @default(cuid())
  name      String
  role      String
  bio       String?
  photo     Media?   @relation(fields: [photoId], references: [id])
  photoId   String?
  socials   Json?    // { twitter, linkedin, github, ... }
  order     Int      @default(0)
  status    Status   @default(DRAFT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Media {
  id        String   @id @default(cuid())
  filename  String
  url       String
  mimeType  String
  width     Int?
  height    Int?
  alt       String?
  size      Int
  createdAt DateTime @default(now())

  posts       Post[]
  teamMembers TeamMember[]
}
```

Notes:
- Post/Page bodies store the **Tiptap JSON document**, rendered to sanitized
  HTML when displayed on the public site.
- `Media` is referenced by both `Post.coverImage` and `TeamMember.photo`.

## Authentication

- Auth.js v5 with the **Credentials** provider. Passwords hashed with bcrypt.
- JWT session strategy; session carries `userId` and `role`.
- `middleware.ts` redirects unauthenticated requests for `/admin/*` (except
  `/admin/login`) to the login page.
- `prisma/seed.ts` creates the first `ADMIN` user from `SEED_ADMIN_EMAIL` /
  `SEED_ADMIN_PASSWORD` env vars so the CMS is usable immediately after setup.
- Role gating: `EDITOR` can manage content; `ADMIN` additionally can manage
  users (user management UI itself is a later iteration, but the role exists).

## Media Library

- Upload endpoint (`/api/upload`) accepts image files, writes them to
  `public/uploads/`, and creates a `Media` record (capturing dimensions for
  images via `sharp`).
- All file writes go through a single **storage adapter** module in `src/server/`
  so a future S3/R2 backend is a drop-in replacement without touching CMS code.
- The admin media page lists uploaded media and lets editors pick images for
  post covers and team photos.

## Content Flow

1. Editor logs in at `/admin/login`.
2. Creates/edits a Post/Page/TeamMember with the Tiptap editor + media picker.
3. On save with `status = PUBLISHED`, the relevant public path is revalidated.
4. Public visitors see published content; drafts are never exposed publicly.

## Validation & Error Handling

- All admin mutations validated with **Zod** schemas (shared between client form
  and server action).
- Slugs auto-generated from titles via a `slugify` helper, with uniqueness
  enforced at the DB level (`@unique`) and a friendly error on collision.
- Public dynamic routes return Next.js `notFound()` for missing/unpublished slugs.
- Upload endpoint rejects non-image / oversized files with a clear error.

## Testing (deferred)

No test harness in v1 per scope decision. Code is structured to be testable
later: pure helpers (`slugify`, validation, content queries) live in `lib/` and
`server/` separate from React components, so Vitest unit tests and Playwright
smoke tests (login → create page → see it live) can be added without refactor.

## Local Dev Setup (target)

1. `pnpm install`
2. `docker compose up -d` (starts Postgres)
3. Copy `.env.example` → `.env`, set `DATABASE_URL`, `AUTH_SECRET`,
   `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
4. `pnpm prisma migrate dev` then `pnpm prisma db seed`
5. `pnpm dev` → public site at `/`, CMS at `/admin`

## Open Questions / Future Work

- Cloud storage adapter (S3/R2) for production media.
- User-management admin UI for `ADMIN` role.
- Test harness (Vitest + Playwright).
- Navigation builder (currently `showInNav`/`navOrder` drive a simple nav).
- SEO metadata fields per page/post.
