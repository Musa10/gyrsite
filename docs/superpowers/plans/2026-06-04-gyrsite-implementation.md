# GYRsite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build GYRsite — a tech company's main marketing site plus a built-in CMS in one Next.js app, with Postgres/Prisma, Auth.js credentials login, Tailwind/shadcn UI, a Tiptap editor, dynamic DB-driven pages, and a local-disk media library.

**Architecture:** A single Next.js (App Router, TypeScript, `src/`) application with two surfaces — a public `(site)` route group and an auth-gated `/admin` CMS. Content (Post, Page, TeamMember, Media) lives in Postgres via Prisma. Pages are published dynamically: a `[...slug]` catch-all renders `Page` rows so new pages go live with no redeploy. File writes go through a single storage adapter so S3/R2 can replace local disk later.

**Tech Stack:** Next.js (App Router) + TypeScript, Postgres (Docker Compose), Prisma, Auth.js v5 (`next-auth@beta`) credentials + bcrypt, Tailwind CSS + shadcn/ui, Tiptap, Zod, pnpm. No test harness in v1 (deferred); verification is command/route based.

**Conventions for the executor:**
- Run every command from the repo root `C:/Users/Musa/repos/GYRsite` unless stated.
- This repo already exists and is a git repo (it holds the spec). Do NOT `git init` again.
- Commit after every task with the message shown.
- Windows/PowerShell host. Commands below are cross-shell; where a shell-specific form is needed, both are noted.

---

## Phase 1 — Scaffold & Tooling

### Task 1: Scaffold the Next.js app into the existing repo

**Files:**
- Create: app scaffold (`package.json`, `src/app/*`, `next.config.ts`, `tsconfig.json`, `tailwind`, etc.)
- Preserve: existing `docs/`, `.git/`, `.gitignore`

- [ ] **Step 1: Scaffold into a temp dir, then move in** (create-next-app refuses a non-empty dir)

```bash
# from C:/Users/Musa/repos
pnpm create next-app@latest gyrsite-tmp --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --use-pnpm --no-turbopack
```
When prompted for anything not covered by flags, accept defaults.

- [ ] **Step 2: Merge scaffold into the repo** (move everything except its `.git`/`node_modules`)

PowerShell:
```powershell
cd C:/Users/Musa/repos
Get-ChildItem -Path gyrsite-tmp -Force |
  Where-Object { $_.Name -notin '.git','node_modules' } |
  ForEach-Object { Move-Item -Path $_.FullName -Destination GYRsite -Force }
Remove-Item -Recurse -Force gyrsite-tmp
```

- [ ] **Step 3: Update `.gitignore`** — ensure these lines exist (append any missing):

```
node_modules/
.next/
.env
.env*.local
*.log
/public/uploads/*
!/public/uploads/.gitkeep
```

- [ ] **Step 4: Install and boot**

```bash
cd C:/Users/Musa/repos/GYRsite
pnpm install
pnpm dev
```
Expected: dev server starts on http://localhost:3000 and the default Next page renders. Stop the server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app (App Router, TS, src, Tailwind)"
```

---

### Task 2: Install project dependencies

**Files:**
- Modify: `package.json` (via pnpm add)

- [ ] **Step 1: Add runtime + dev deps**

```bash
pnpm add @prisma/client next-auth@beta bcryptjs zod sharp \
  @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link \
  class-variance-authority clsx tailwind-merge lucide-react
pnpm add -D prisma @types/bcryptjs tsx
```

- [ ] **Step 2: Verify install**

```bash
pnpm list next-auth prisma @tiptap/react zod
```
Expected: each package resolves to a version with no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: add prisma, auth, tiptap, zod, sharp deps"
```

---

### Task 3: Initialize shadcn/ui

**Files:**
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/*`

- [ ] **Step 1: Init shadcn**

```bash
pnpm dlx shadcn@latest init -d
```
`-d` accepts defaults (New York style, Slate base, CSS variables). It writes `components.json` and `src/lib/utils.ts` (the `cn` helper).

- [ ] **Step 2: Add the UI primitives we will use**

```bash
pnpm dlx shadcn@latest add button input label textarea card table \
  dialog dropdown-menu form sonner badge select
```

- [ ] **Step 3: Verify `cn` helper exists**

Confirm `src/lib/utils.ts` exports `cn`. Run:
```bash
pnpm exec tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: init shadcn/ui and add base components"
```

---

## Phase 2 — Database & Prisma

### Task 4: Local Postgres via Docker Compose

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `.env` (local, gitignored)

- [ ] **Step 1: Create `docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16
    container_name: gyrsite-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: gyrsite
      POSTGRES_PASSWORD: gyrsite
      POSTGRES_DB: gyrsite
    ports:
      - "5432:5432"
    volumes:
      - gyrsite_pgdata:/var/lib/postgresql/data

volumes:
  gyrsite_pgdata:
```

- [ ] **Step 2: Create `.env.example`**

```bash
DATABASE_URL="postgresql://gyrsite:gyrsite@localhost:5432/gyrsite?schema=public"
AUTH_SECRET="replace-me-with-openssl-rand-base64-32"
AUTH_TRUST_HOST="true"
SEED_ADMIN_EMAIL="admin@gyrsite.test"
SEED_ADMIN_PASSWORD="changeme123"
```

- [ ] **Step 3: Create `.env`** — copy `.env.example` to `.env` and set a real `AUTH_SECRET`:

```bash
# value:
pnpm dlx auth secret
```
Or generate manually and paste into `.env` as `AUTH_SECRET="..."`. (`pnpm dlx auth secret` writes/append AUTH_SECRET to `.env` automatically.)

- [ ] **Step 4: Start the database**

```bash
docker compose up -d
docker compose ps
```
Expected: `gyrsite-db` is `running`/healthy on port 5432.

- [ ] **Step 5: Commit** (`.env` stays untracked)

```bash
git add docker-compose.yml .env.example
git commit -m "chore: local Postgres compose + env example"
```

---

### Task 5: Prisma schema + client singleton

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/db/prisma.ts`

- [ ] **Step 1: Initialize Prisma config without overwriting env**

```bash
pnpm prisma init --datasource-provider postgresql
```
This creates `prisma/schema.prisma`. If it appended a duplicate `DATABASE_URL` to `.env`, remove the duplicate so only the one from Task 4 remains.

- [ ] **Step 2: Replace `prisma/schema.prisma` with the full model**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  EDITOR
}

enum Status {
  DRAFT
  PUBLISHED
}

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
  body         Json
  coverImage   Media?    @relation("PostCover", fields: [coverImageId], references: [id])
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
  body        Json
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
  photo     Media?   @relation("TeamPhoto", fields: [photoId], references: [id])
  photoId   String?
  socials   Json?
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

  postCovers  Post[]       @relation("PostCover")
  teamPhotos  TeamMember[] @relation("TeamPhoto")
}
```

- [ ] **Step 3: Create the Prisma client singleton `src/db/prisma.ts`**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Create the first migration and generate the client**

```bash
pnpm prisma migrate dev --name init
```
Expected: migration `init` applied; `@prisma/client` generated; tables `User`, `Post`, `Page`, `TeamMember`, `Media` created.

- [ ] **Step 5: Verify schema is valid and DB is reachable**

```bash
pnpm prisma validate
pnpm prisma db pull --print | head -5
```
Expected: "The schema is valid"; `db pull --print` prints schema (DB reachable).

- [ ] **Step 6: Commit**

```bash
git add prisma src/db/prisma.ts
git commit -m "feat(db): prisma schema, client singleton, init migration"
```

---

### Task 6: Seed the first admin user

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add `prisma.seed` config + `db:seed` script)

- [ ] **Step 1: Create `prisma/seed.ts`**

```ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin", role: Role.ADMIN, passwordHash },
  });

  console.log(`Seeded admin user: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 2: Wire up the seed in `package.json`** — add a top-level `"prisma"` block and a script:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
},
"scripts": {
  "db:seed": "tsx prisma/seed.ts"
}
```
(Merge `db:seed` into the existing `scripts` object; keep existing scripts.)

- [ ] **Step 3: Run the seed**

```bash
pnpm db:seed
```
Expected: prints `Seeded admin user: admin@gyrsite.test`.

- [ ] **Step 4: Verify the row exists**

```bash
pnpm prisma studio
```
Open the `User` table, confirm one ADMIN user, then close Studio. (Or `pnpm prisma db execute --stdin` with `SELECT email,role FROM "User";`.)

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat(db): seed initial admin user"
```

---

## Phase 3 — Authentication

### Task 7: Auth.js config split (edge-safe middleware + Node credentials)

**Why split:** bcrypt cannot run in the Edge middleware runtime. `auth.config.ts` holds the edge-safe pieces (providers list shell + `authorized` callback) used by middleware; `auth.ts` adds the Credentials provider that uses bcrypt and runs in the Node runtime.

**Files:**
- Create: `src/auth.config.ts`
- Create: `src/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/lib/zod-auth.ts`
- Create: `middleware.ts` (repo root)
- Create: `src/types/next-auth.d.ts`

- [ ] **Step 1: Create the sign-in schema `src/lib/zod-auth.ts`**

```ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;
```

- [ ] **Step 2: Create `src/auth.config.ts` (edge-safe)**

```ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [], // real providers added in auth.ts (Node runtime)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      if (isOnLogin) return true; // login page always reachable
      if (isOnAdmin) return isLoggedIn; // gate the rest of /admin
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
```

- [ ] **Step 3: Create `src/auth.ts` (Node runtime, Credentials + bcrypt)**

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { prisma } from "@/db/prisma";
import { signInSchema } from "@/lib/zod-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
```

- [ ] **Step 4: Create the route handler `src/app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 5: Create `middleware.ts` at the repo root (edge-safe config only)**

```ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // run on everything except static assets and the auth API
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 6: Create `src/types/next-auth.d.ts` (typed id/role on session)**

```ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
}
```

- [ ] **Step 7: Typecheck**

```bash
pnpm exec tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 8: Commit**

```bash
git add src/auth.config.ts src/auth.ts src/app/api/auth src/lib/zod-auth.ts middleware.ts src/types/next-auth.d.ts
git commit -m "feat(auth): Auth.js credentials with edge-safe middleware split"
```

---

### Task 8: Login page + sign-in/out server actions

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/login-form.tsx`
- Create: `src/server/auth-actions.ts`

- [ ] **Step 1: Create sign-in/out actions `src/server/auth-actions.ts`**

```ts
"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function authenticate(
  _prev: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password.";
    }
    throw error; // re-throw redirect control flow
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
```

- [ ] **Step 2: Create the client form `src/app/admin/login/login-form.tsx`**

```tsx
"use client";

import { useActionState } from "react";
import { authenticate } from "@/server/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Create the login page `src/app/admin/login/page.tsx`**

```tsx
import { LoginForm } from "./login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>GYRsite CMS</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Verify the login flow end to end**

```bash
pnpm dev
```
- Visit `http://localhost:3000/admin` → should redirect to `/admin/login`.
- Sign in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` → should redirect to `/admin` (will 404 the dashboard until Task 9 — that's expected; the point is the redirect off the login page succeeds and no auth error shows).
- Sign in with a wrong password → "Invalid email or password." appears.
Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/login src/server/auth-actions.ts
git commit -m "feat(auth): login page and sign-in/out actions"
```

---

## Phase 4 — Admin Shell & Shared Building Blocks

### Task 9: Admin layout, dashboard, and session helper

**Files:**
- Create: `src/server/session.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/sidebar.tsx`
- Create: `src/components/admin/logout-button.tsx`

- [ ] **Step 1: Create a session helper `src/server/session.ts`**

```ts
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}
```

- [ ] **Step 2: Create the logout button `src/components/admin/logout-button.tsx`**

```tsx
import { logout } from "@/server/auth-actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="sm">
        Sign out
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Create the sidebar `src/components/admin/sidebar.tsx`**

```tsx
import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/media", label: "Media" },
];

export function Sidebar() {
  return (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded px-3 py-2 text-sm hover:bg-muted"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Create the admin layout `src/app/admin/layout.tsx`** (guards everything except the login subtree, which has its own page)

```tsx
import { Sidebar } from "@/components/admin/sidebar";
import { LogoutButton } from "@/components/admin/logout-button";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // The login page renders its own full-screen UI; when unauthenticated we
  // simply render children (the login page handles its own layout).
  if (!session?.user) return <>{children}</>;

  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r bg-muted/20">
        <div className="flex h-14 items-center px-4 font-semibold">GYRsite CMS</div>
        <Sidebar />
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
          <LogoutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create the dashboard `src/app/admin/page.tsx`** (counts per content type)

```tsx
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  await requireUser();

  const [posts, pages, team, media] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.teamMember.count(),
    prisma.media.count(),
  ]);

  const stats = [
    { label: "Posts", value: posts },
    { label: "Pages", value: pages },
    { label: "Team", value: team },
    { label: "Media", value: media },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {s.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{s.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Verify**

```bash
pnpm dev
```
Log in → `/admin` shows the sidebar, header with your email, a working "Sign out" button, and four count cards (all 0). Sign out returns you to the login page. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/server/session.ts src/app/admin/layout.tsx src/app/admin/page.tsx src/components/admin
git commit -m "feat(admin): layout shell, dashboard, session helper"
```

---

### Task 10: Shared utilities — slugify and Tiptap render/types

**Files:**
- Create: `src/lib/slugify.ts`
- Create: `src/lib/tiptap.ts`
- Create: `src/lib/content-types.ts`

- [ ] **Step 1: Create `src/lib/slugify.ts`**

```ts
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Slugs the public catch-all must never claim.
export const RESERVED_SLUGS = new Set(["admin", "api", "blog", "team", ""]);
```

- [ ] **Step 2: Create Tiptap shared module `src/lib/tiptap.ts`** (extension list shared by editor + renderer, plus server-side HTML generation)

```ts
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/react";

export const tiptapExtensions = [
  StarterKit,
  Link.configure({ openOnClick: false }),
];

export const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function renderTiptap(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  return generateHTML(doc as JSONContent, tiptapExtensions);
}
```

If `@tiptap/html` is not already present, add it: `pnpm add @tiptap/html`.

- [ ] **Step 3: Create shared content enums `src/lib/content-types.ts`**

```ts
export const STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type ContentStatus = (typeof STATUSES)[number];
```

- [ ] **Step 4: Typecheck**

```bash
pnpm exec tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/slugify.ts src/lib/tiptap.ts src/lib/content-types.ts package.json
git commit -m "feat(lib): slugify, tiptap render helpers, content types"
```

---

### Task 11: Tiptap editor component

**Files:**
- Create: `src/components/editor/rich-text-editor.tsx`

- [ ] **Step 1: Create the editor `src/components/editor/rich-text-editor.tsx`** (controlled; emits JSON via hidden input for native form submission)

```tsx
"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { useState } from "react";
import { tiptapExtensions, EMPTY_DOC } from "@/lib/tiptap";
import { Button } from "@/components/ui/button";

export function RichTextEditor({
  name,
  initialContent,
}: {
  name: string;
  initialContent?: JSONContent;
}) {
  const [json, setJson] = useState<JSONContent>(initialContent ?? EMPTY_DOC);

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: json,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[240px] rounded-md border p-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setJson(editor.getJSON()),
  });

  return (
    <div className="space-y-2">
      {editor && (
        <div className="flex flex-wrap gap-1">
          <Button type="button" size="sm" variant="outline"
            onClick={() => editor.chain().focus().toggleBold().run()}>Bold</Button>
          <Button type="button" size="sm" variant="outline"
            onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</Button>
          <Button type="button" size="sm" variant="outline"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
          <Button type="button" size="sm" variant="outline"
            onClick={() => editor.chain().focus().toggleBulletList().run()}>List</Button>
        </div>
      )}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={JSON.stringify(json)} />
    </div>
  );
}
```

- [ ] **Step 2: Add Tailwind typography for `prose`**

```bash
pnpm add -D @tailwindcss/typography
```
Then register it. For Tailwind v4 (CSS-config), add to `src/app/globals.css`:
```css
@plugin "@tailwindcss/typography";
```
(For a Tailwind v3 `tailwind.config.ts`, add `require("@tailwindcss/typography")` to `plugins` instead. Check which version `pnpm list tailwindcss` reports and use the matching form.)

- [ ] **Step 3: Typecheck**

```bash
pnpm exec tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/editor globals.css package.json src/app/globals.css
git commit -m "feat(editor): Tiptap rich-text editor component"
```

---

## Phase 5 — Media Library

### Task 12: Storage adapter + upload API

**Files:**
- Create: `src/server/storage.ts`
- Create: `src/server/media.ts`
- Create: `src/app/api/upload/route.ts`
- Create: `public/uploads/.gitkeep`

- [ ] **Step 1: Create the storage adapter `src/server/storage.ts`** (single seam for future S3/R2)

```ts
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type StoredFile = { url: string; filename: string };

/** Persist bytes and return a public URL. Swap this body for S3/R2 later. */
export async function storeFile(
  filename: string,
  bytes: Buffer
): Promise<StoredFile> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const safe = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  await writeFile(path.join(UPLOAD_DIR, safe), bytes);
  return { url: `/uploads/${safe}`, filename: safe };
}
```

- [ ] **Step 2: Create media service `src/server/media.ts`**

```ts
import sharp from "sharp";
import { prisma } from "@/db/prisma";
import { storeFile } from "@/server/storage";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function createMediaFromUpload(file: File) {
  if (!ALLOWED.has(file.type)) throw new Error("Unsupported file type");
  if (file.size > MAX_BYTES) throw new Error("File too large (max 8MB)");

  const bytes = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(bytes).metadata();
  const { url, filename } = await storeFile(file.name, bytes);

  return prisma.media.create({
    data: {
      filename,
      url,
      mimeType: file.type,
      size: file.size,
      width: meta.width ?? null,
      height: meta.height ?? null,
    },
  });
}

export function listMedia() {
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
}
```

- [ ] **Step 3: Create the upload route `src/app/api/upload/route.ts`**

```ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMediaFromUpload } from "@/server/media";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const media = await createMediaFromUpload(file);
    return NextResponse.json(media, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

- [ ] **Step 4: Create the uploads dir keeper**

Create empty file `public/uploads/.gitkeep`.

- [ ] **Step 5: Verify the API rejects unauthenticated uploads**

```bash
pnpm dev
```
In a second terminal:
```bash
curl -i -X POST http://localhost:3000/api/upload -F "file=@README.md"
```
Expected: `401 Unauthorized` (no session). Authenticated upload is exercised via the UI in Task 13. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/server/storage.ts src/server/media.ts src/app/api/upload public/uploads/.gitkeep
git commit -m "feat(media): storage adapter, upload API, media service"
```

---

### Task 13: Media admin page (upload + browse + picker)

**Files:**
- Create: `src/app/admin/media/page.tsx`
- Create: `src/components/admin/media-uploader.tsx`
- Create: `src/components/admin/media-picker.tsx`

- [ ] **Step 1: Create the uploader `src/components/admin/media-uploader.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Upload failed");
      return;
    }
    e.target.value = "";
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Input type="file" accept="image/*" disabled={busy} onChange={onChange} />
      {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create the media page `src/app/admin/media/page.tsx`**

```tsx
import Image from "next/image";
import { requireUser } from "@/server/session";
import { listMedia } from "@/server/media";
import { MediaUploader } from "@/components/admin/media-uploader";

export default async function MediaPage() {
  await requireUser();
  const media = await listMedia();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media</h1>
      </div>
      <MediaUploader />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {media.map((m) => (
          <figure key={m.id} className="overflow-hidden rounded border">
            <Image
              src={m.url}
              alt={m.alt ?? m.filename}
              width={m.width ?? 300}
              height={m.height ?? 200}
              className="h-32 w-full object-cover"
            />
            <figcaption className="truncate p-2 text-xs text-muted-foreground">
              {m.filename}
            </figcaption>
          </figure>
        ))}
        {media.length === 0 && (
          <p className="text-sm text-muted-foreground">No media yet.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Allow local upload images in `next.config.ts`** — uploads are served from `/uploads/...` (same origin), so `next/image` needs no remote patterns. Confirm `next.config.ts` has no `images.unoptimized` requirement; if `next/image` errors on local files, add:
```ts
images: { dangerouslyAllowSVG: false },
```
(No remote pattern needed for same-origin `/uploads`.)

- [ ] **Step 4: Create the picker `src/components/admin/media-picker.tsx`** (used by Post/Team forms to select a cover/photo)

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type MediaItem = { id: string; url: string; filename: string };

export function MediaPicker({
  name,
  media,
  initialId,
}: {
  name: string;
  media: MediaItem[];
  initialId?: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(initialId ?? null);

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={selected ?? ""} />
      <div className="flex flex-wrap gap-2">
        {selected && (
          <Button type="button" size="sm" variant="ghost"
            onClick={() => setSelected(null)}>Clear</Button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {media.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelected(m.id)}
            className={`overflow-hidden rounded border ${
              selected === m.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <Image src={m.url} alt={m.filename} width={120} height={80}
              className="h-16 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify upload + browse**

```bash
pnpm dev
```
Log in → `/admin/media` → choose an image → it uploads, the grid refreshes and shows the thumbnail; the file appears under `public/uploads/`. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/media src/components/admin/media-uploader.tsx src/components/admin/media-picker.tsx next.config.ts
git commit -m "feat(media): admin media page, uploader, picker"
```

---

## Phase 6 — Content CRUD (Posts, Pages, Team)

### Task 14: Posts — validation schema + server actions

**Files:**
- Create: `src/lib/schemas/post.ts`
- Create: `src/server/posts.ts`

- [ ] **Step 1: Create the Zod schema `src/lib/schemas/post.ts`**

```ts
import { z } from "zod";
import { STATUSES } from "@/lib/content-types";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  body: z.string().min(2, "Body is required"), // JSON string from the editor
  coverImageId: z.string().optional().nullable(),
  tags: z.string().optional(), // comma-separated in the form
  status: z.enum(STATUSES),
});

export type PostInput = z.infer<typeof postSchema>;
```

- [ ] **Step 2: Create post actions `src/server/posts.ts`**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireUser } from "@/server/session";
import { slugify } from "@/lib/slugify";
import { postSchema } from "@/lib/schemas/post";

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

export async function savePost(id: string | null, formData: FormData) {
  const user = await requireUser();

  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid post");
  }
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  const status = d.status;

  const data = {
    title: d.title,
    slug,
    excerpt: d.excerpt || null,
    body: JSON.parse(d.body),
    coverImageId: d.coverImageId || null,
    tags: parseTags(d.tags),
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    authorId: user.id,
  };

  if (id) {
    await prisma.post.update({ where: { id }, data });
  } else {
    await prisma.post.create({ data });
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireUser();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm exec tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/schemas/post.ts src/server/posts.ts
git commit -m "feat(posts): post schema and server actions"
```

---

### Task 15: Posts — admin list + create/edit form

**Files:**
- Create: `src/app/admin/posts/page.tsx`
- Create: `src/app/admin/posts/new/page.tsx`
- Create: `src/app/admin/posts/[id]/edit/page.tsx`
- Create: `src/components/admin/post-form.tsx`
- Create: `src/components/admin/delete-button.tsx`

- [ ] **Step 1: Create a reusable delete button `src/components/admin/delete-button.tsx`**

```tsx
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  id,
}: {
  action: (id: string) => Promise<void>;
  id: string;
}) {
  return (
    <form action={action.bind(null, id)}>
      <Button type="submit" variant="ghost" size="sm" className="text-red-600">
        Delete
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Create the post form `src/components/admin/post-form.tsx`**

```tsx
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { JSONContent } from "@tiptap/react";

type MediaItem = { id: string; url: string; filename: string };

export function PostForm({
  action,
  media,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  media: MediaItem[];
  initial?: {
    title: string;
    slug: string;
    excerpt: string | null;
    body: JSONContent;
    coverImageId: string | null;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={initial?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (optional — derived from title)</Label>
        <Input id="slug" name="slug" defaultValue={initial?.slug} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={initial?.excerpt ?? ""} />
      </div>
      <div className="space-y-2">
        <Label>Body</Label>
        <RichTextEditor name="body" initialContent={initial?.body} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" defaultValue={initial?.tags.join(", ")} />
      </div>
      <div className="space-y-2">
        <Label>Cover image</Label>
        <MediaPicker name="coverImageId" media={media} initialId={initial?.coverImageId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={initial?.status ?? "DRAFT"}
          className="block w-40 rounded-md border p-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
```

- [ ] **Step 3: Create the posts list `src/app/admin/posts/page.tsx`**

```tsx
import Link from "next/link";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { deletePost } from "@/server/posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function PostsPage() {
  await requireUser();
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Button asChild><Link href="/admin/posts/new">New post</Link></Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.title}</TableCell>
              <TableCell>
                <Badge variant={p.status === "PUBLISHED" ? "default" : "secondary"}>
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/posts/${p.id}/edit`}>Edit</Link>
                </Button>
                <DeleteButton action={deletePost} id={p.id} />
              </TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">
                No posts yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 4: Create the "new post" page `src/app/admin/posts/new/page.tsx`**

```tsx
import { requireUser } from "@/server/session";
import { listMedia } from "@/server/media";
import { savePost } from "@/server/posts";
import { PostForm } from "@/components/admin/post-form";

export default async function NewPostPage() {
  await requireUser();
  const media = await listMedia();
  const action = savePost.bind(null, null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New post</h1>
      <PostForm action={action} media={media} />
    </div>
  );
}
```

- [ ] **Step 5: Create the edit page `src/app/admin/posts/[id]/edit/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { listMedia } from "@/server/media";
import { savePost } from "@/server/posts";
import { PostForm } from "@/components/admin/post-form";
import { EMPTY_DOC } from "@/lib/tiptap";
import type { JSONContent } from "@tiptap/react";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const [post, media] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    listMedia(),
  ]);
  if (!post) notFound();

  const action = savePost.bind(null, post.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <PostForm
        action={action}
        media={media}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: (post.body as JSONContent) ?? EMPTY_DOC,
          coverImageId: post.coverImageId,
          tags: post.tags,
          status: post.status,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Verify full Post CRUD**

```bash
pnpm dev
```
Log in → Posts → New post → fill title + body, set Published, Save → returns to list showing the post with a PUBLISHED badge → Edit → change title → Save persists → Delete removes it. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/posts src/components/admin/post-form.tsx src/components/admin/delete-button.tsx
git commit -m "feat(posts): admin list, create/edit forms, delete"
```

---

### Task 16: Pages — schema, actions, admin CRUD

**Files:**
- Create: `src/lib/schemas/page.ts`
- Create: `src/server/pages.ts`
- Create: `src/components/admin/page-form.tsx`
- Create: `src/app/admin/pages/page.tsx`
- Create: `src/app/admin/pages/new/page.tsx`
- Create: `src/app/admin/pages/[id]/edit/page.tsx`

- [ ] **Step 1: Create `src/lib/schemas/page.ts`**

```ts
import { z } from "zod";
import { STATUSES } from "@/lib/content-types";

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  body: z.string().min(2, "Body is required"),
  status: z.enum(STATUSES),
  showInNav: z.union([z.literal("on"), z.literal("")]).optional(),
  navOrder: z.string().optional(),
});

export type PageInput = z.infer<typeof pageSchema>;
```

- [ ] **Step 2: Create `src/server/pages.ts`** (rejects reserved slugs so dynamic pages can't shadow `/blog`, `/team`, `/admin`)

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireUser } from "@/server/session";
import { slugify, RESERVED_SLUGS } from "@/lib/slugify";
import { pageSchema } from "@/lib/schemas/page";

export async function savePage(id: string | null, formData: FormData) {
  await requireUser();

  const parsed = pageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid page");
  }
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);

  if (RESERVED_SLUGS.has(slug)) {
    throw new Error(`"${slug}" is a reserved slug; choose another.`);
  }

  const status = d.status;
  const data = {
    title: d.title,
    slug,
    body: JSON.parse(d.body),
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    showInNav: d.showInNav === "on",
    navOrder: d.navOrder ? parseInt(d.navOrder, 10) || 0 : 0,
  };

  if (id) {
    await prisma.page.update({ where: { id }, data });
  } else {
    await prisma.page.create({ data });
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`);
  revalidatePath("/", "layout"); // refresh nav
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await requireUser();
  const page = await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
  revalidatePath("/", "layout");
}
```

- [ ] **Step 3: Create `src/components/admin/page-form.tsx`**

```tsx
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { JSONContent } from "@tiptap/react";

export function PageForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title: string;
    slug: string;
    body: JSONContent;
    status: "DRAFT" | "PUBLISHED";
    showInNav: boolean;
    navOrder: number;
  };
}) {
  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={initial?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (optional — derived from title)</Label>
        <Input id="slug" name="slug" defaultValue={initial?.slug} />
      </div>
      <div className="space-y-2">
        <Label>Body</Label>
        <RichTextEditor name="body" initialContent={initial?.body} />
      </div>
      <div className="flex items-center gap-2">
        <input id="showInNav" name="showInNav" type="checkbox"
          defaultChecked={initial?.showInNav} />
        <Label htmlFor="showInNav">Show in navigation</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="navOrder">Nav order</Label>
        <Input id="navOrder" name="navOrder" type="number"
          defaultValue={initial?.navOrder ?? 0} className="w-32" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" defaultValue={initial?.status ?? "DRAFT"}
          className="block w-40 rounded-md border p-2">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
```

- [ ] **Step 4: Create the pages list `src/app/admin/pages/page.tsx`**

```tsx
import Link from "next/link";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { deletePage } from "@/server/pages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function PagesPage() {
  await requireUser();
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Button asChild><Link href="/admin/pages/new">New page</Link></Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.title}</TableCell>
              <TableCell className="text-muted-foreground">/{p.slug}</TableCell>
              <TableCell>
                <Badge variant={p.status === "PUBLISHED" ? "default" : "secondary"}>
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/pages/${p.id}/edit`}>Edit</Link>
                </Button>
                <DeleteButton action={deletePage} id={p.id} />
              </TableCell>
            </TableRow>
          ))}
          {pages.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                No pages yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/admin/pages/new/page.tsx`**

```tsx
import { requireUser } from "@/server/session";
import { savePage } from "@/server/pages";
import { PageForm } from "@/components/admin/page-form";

export default async function NewPage() {
  await requireUser();
  const action = savePage.bind(null, null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New page</h1>
      <PageForm action={action} />
    </div>
  );
}
```

- [ ] **Step 6: Create `src/app/admin/pages/[id]/edit/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { savePage } from "@/server/pages";
import { PageForm } from "@/components/admin/page-form";
import { EMPTY_DOC } from "@/lib/tiptap";
import type { JSONContent } from "@tiptap/react";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const action = savePage.bind(null, page.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit page</h1>
      <PageForm
        action={action}
        initial={{
          title: page.title,
          slug: page.slug,
          body: (page.body as JSONContent) ?? EMPTY_DOC,
          status: page.status,
          showInNav: page.showInNav,
          navOrder: page.navOrder,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 7: Verify Page CRUD + reserved-slug guard**

```bash
pnpm dev
```
Log in → Pages → New page titled "About", body text, Published, Save → appears in list as `/about`. Try creating a page with slug `blog` → save fails with the reserved-slug error. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add src/lib/schemas/page.ts src/server/pages.ts src/components/admin/page-form.tsx src/app/admin/pages
git commit -m "feat(pages): schema, actions, admin CRUD with reserved-slug guard"
```

---

### Task 17: Team — schema, actions, admin CRUD

**Files:**
- Create: `src/lib/schemas/team.ts`
- Create: `src/server/team.ts`
- Create: `src/components/admin/team-form.tsx`
- Create: `src/app/admin/team/page.tsx`
- Create: `src/app/admin/team/new/page.tsx`
- Create: `src/app/admin/team/[id]/edit/page.tsx`

- [ ] **Step 1: Create `src/lib/schemas/team.ts`**

```ts
import { z } from "zod";
import { STATUSES } from "@/lib/content-types";

export const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional(),
  photoId: z.string().optional().nullable(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  order: z.string().optional(),
  status: z.enum(STATUSES),
});

export type TeamInput = z.infer<typeof teamSchema>;
```

- [ ] **Step 2: Create `src/server/team.ts`**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireUser } from "@/server/session";
import { teamSchema } from "@/lib/schemas/team";

export async function saveTeamMember(id: string | null, formData: FormData) {
  await requireUser();

  const parsed = teamSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid team member");
  }
  const d = parsed.data;

  const data = {
    name: d.name,
    role: d.role,
    bio: d.bio || null,
    photoId: d.photoId || null,
    socials: {
      twitter: d.twitter || null,
      linkedin: d.linkedin || null,
      github: d.github || null,
    },
    order: d.order ? parseInt(d.order, 10) || 0 : 0,
    status: d.status,
  };

  if (id) {
    await prisma.teamMember.update({ where: { id }, data });
  } else {
    await prisma.teamMember.create({ data });
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await requireUser();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}
```

- [ ] **Step 3: Create `src/components/admin/team-form.tsx`**

```tsx
import { MediaPicker } from "@/components/admin/media-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type MediaItem = { id: string; url: string; filename: string };

export function TeamForm({
  action,
  media,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  media: MediaItem[];
  initial?: {
    name: string;
    role: string;
    bio: string | null;
    photoId: string | null;
    socials: { twitter?: string | null; linkedin?: string | null; github?: string | null };
    order: number;
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initial?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" defaultValue={initial?.role} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={initial?.bio ?? ""} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input id="twitter" name="twitter" defaultValue={initial?.socials.twitter ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" name="linkedin" defaultValue={initial?.socials.linkedin ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input id="github" name="github" defaultValue={initial?.socials.github ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Photo</Label>
        <MediaPicker name="photoId" media={media} initialId={initial?.photoId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Order</Label>
        <Input id="order" name="order" type="number"
          defaultValue={initial?.order ?? 0} className="w-32" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" defaultValue={initial?.status ?? "DRAFT"}
          className="block w-40 rounded-md border p-2">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
```

- [ ] **Step 4: Create the team list `src/app/admin/team/page.tsx`**

```tsx
import Link from "next/link";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { deleteTeamMember } from "@/server/team";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function TeamPage() {
  await requireUser();
  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Team</h1>
        <Button asChild><Link href="/admin/team/new">New member</Link></Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell className="text-muted-foreground">{m.role}</TableCell>
              <TableCell>
                <Badge variant={m.status === "PUBLISHED" ? "default" : "secondary"}>
                  {m.status}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/team/${m.id}/edit`}>Edit</Link>
                </Button>
                <DeleteButton action={deleteTeamMember} id={m.id} />
              </TableCell>
            </TableRow>
          ))}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                No team members yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/admin/team/new/page.tsx`**

```tsx
import { requireUser } from "@/server/session";
import { listMedia } from "@/server/media";
import { saveTeamMember } from "@/server/team";
import { TeamForm } from "@/components/admin/team-form";

export default async function NewTeamMemberPage() {
  await requireUser();
  const media = await listMedia();
  const action = saveTeamMember.bind(null, null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New team member</h1>
      <TeamForm action={action} media={media} />
    </div>
  );
}
```

- [ ] **Step 6: Create `src/app/admin/team/[id]/edit/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { listMedia } from "@/server/media";
import { saveTeamMember } from "@/server/team";
import { TeamForm } from "@/components/admin/team-form";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const [member, media] = await Promise.all([
    prisma.teamMember.findUnique({ where: { id } }),
    listMedia(),
  ]);
  if (!member) notFound();

  const socials = (member.socials as {
    twitter?: string | null; linkedin?: string | null; github?: string | null;
  }) ?? {};
  const action = saveTeamMember.bind(null, member.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit team member</h1>
      <TeamForm
        action={action}
        media={media}
        initial={{
          name: member.name,
          role: member.role,
          bio: member.bio,
          photoId: member.photoId,
          socials,
          order: member.order,
          status: member.status,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 7: Verify Team CRUD**

```bash
pnpm dev
```
Log in → Team → New member (name, role, optional photo from media), Published, Save → appears in list → Edit → Delete. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add src/lib/schemas/team.ts src/server/team.ts src/components/admin/team-form.tsx src/app/admin/team
git commit -m "feat(team): schema, actions, admin CRUD"
```

---

## Phase 7 — Public Site

### Task 18: Public query helpers

**Files:**
- Create: `src/server/public-content.ts`

- [ ] **Step 1: Create `src/server/public-content.ts`** (only ever returns PUBLISHED content)

```ts
import { prisma } from "@/db/prisma";

export function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { coverImage: true, author: true },
  });
}

export function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { coverImage: true, author: true },
  });
}

export function getPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export function getNavPages() {
  return prisma.page.findMany({
    where: { status: "PUBLISHED", showInNav: true },
    orderBy: { navOrder: "asc" },
    select: { title: true, slug: true },
  });
}

export function getPublishedTeam() {
  return prisma.teamMember.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { photo: true },
  });
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm exec tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/server/public-content.ts
git commit -m "feat(public): published-content query helpers"
```

---

### Task 19: Public layout with dynamic nav + home page

**Files:**
- Create: `src/app/(site)/layout.tsx`
- Create: `src/components/site/site-header.tsx`
- Create: `src/components/site/prose.tsx`
- Replace: `src/app/(site)/page.tsx` (move existing home into the route group)
- Delete: the scaffold's `src/app/page.tsx` (replaced by `(site)/page.tsx`)

- [ ] **Step 1: Create the prose renderer `src/components/site/prose.tsx`** (renders Tiptap JSON to sanitized HTML)

```tsx
import { renderTiptap } from "@/lib/tiptap";

export function Prose({ doc }: { doc: unknown }) {
  const html = renderTiptap(doc);
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

- [ ] **Step 2: Create the site header `src/components/site/site-header.tsx`**

```tsx
import Link from "next/link";
import { getNavPages } from "@/server/public-content";

export async function SiteHeader() {
  const navPages = await getNavPages();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">GYR</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/team" className="hover:underline">Team</Link>
          {navPages.map((p) => (
            <Link key={p.slug} href={`/${p.slug}`} className="hover:underline">
              {p.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create the site layout `src/app/(site)/layout.tsx`**

```tsx
import { SiteHeader } from "@/components/site/site-header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © GYR
      </footer>
    </div>
  );
}
```

- [ ] **Step 4: Move the home page into the group** — delete `src/app/page.tsx`, create `src/app/(site)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-bold">GYR</h1>
      <p className="text-lg text-muted-foreground">
        Building the future of technology.
      </p>
    </section>
  );
}
```

- [ ] **Step 5: Verify home + nav**

```bash
pnpm dev
```
Visit `/` → header shows GYR + Blog + Team (+ any nav pages from Task 16, e.g. About if you marked "show in nav"); home content renders; footer present. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(site)" src/components/site
git rm src/app/page.tsx
git commit -m "feat(public): site layout, dynamic nav, home page"
```

---

### Task 20: Blog index + post detail

**Files:**
- Create: `src/app/(site)/blog/page.tsx`
- Create: `src/app/(site)/blog/[slug]/page.tsx`

- [ ] **Step 1: Create the blog index `src/app/(site)/blog/page.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/server/public-content";

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog</h1>
      {posts.length === 0 && (
        <p className="text-muted-foreground">No posts yet.</p>
      )}
      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.id} className="flex gap-4">
            {p.coverImage && (
              <Image src={p.coverImage.url} alt={p.coverImage.alt ?? p.title}
                width={160} height={100} className="h-24 w-40 rounded object-cover" />
            )}
            <div>
              <Link href={`/blog/${p.slug}`} className="text-xl font-semibold hover:underline">
                {p.title}
              </Link>
              {p.excerpt && <p className="text-muted-foreground">{p.excerpt}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Create the post detail `src/app/(site)/blog/[slug]/page.tsx`**

```tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/server/public-content";
import { Prose } from "@/components/site/prose";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      {post.author && (
        <p className="text-sm text-muted-foreground">By {post.author.name}</p>
      )}
      {post.coverImage && (
        <Image src={post.coverImage.url} alt={post.coverImage.alt ?? post.title}
          width={900} height={500} className="w-full rounded object-cover" />
      )}
      <Prose doc={post.body} />
    </article>
  );
}
```

- [ ] **Step 3: Verify blog**

```bash
pnpm dev
```
Ensure you have a PUBLISHED post (create one in admin if needed). Visit `/blog` → post listed → click it → detail page renders title, author, body. A DRAFT post must NOT appear and its `/blog/<slug>` must 404. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/blog"
git commit -m "feat(public): blog index and post detail"
```

---

### Task 21: Team page + dynamic catch-all pages

**Files:**
- Create: `src/app/(site)/team/page.tsx`
- Create: `src/app/(site)/[...slug]/page.tsx`

- [ ] **Step 1: Create the team page `src/app/(site)/team/page.tsx`**

```tsx
import Image from "next/image";
import { getPublishedTeam } from "@/server/public-content";

export default async function TeamPage() {
  const team = await getPublishedTeam();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Team</h1>
      {team.length === 0 && <p className="text-muted-foreground">No team members yet.</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {team.map((m) => (
          <div key={m.id} className="space-y-2 text-center">
            {m.photo && (
              <Image src={m.photo.url} alt={m.photo.alt ?? m.name}
                width={160} height={160}
                className="mx-auto h-40 w-40 rounded-full object-cover" />
            )}
            <h2 className="text-lg font-semibold">{m.name}</h2>
            <p className="text-sm text-muted-foreground">{m.role}</p>
            {m.bio && <p className="text-sm">{m.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the dynamic page catch-all `src/app/(site)/[...slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/server/public-content";
import { RESERVED_SLUGS } from "@/lib/slugify";
import { Prose } from "@/components/site/prose";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const joined = slug.join("/");

  // Reserved prefixes are handled by their own routes; never resolve here.
  if (RESERVED_SLUGS.has(slug[0])) notFound();

  const page = await getPageBySlug(joined);
  if (!page) notFound();

  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">{page.title}</h1>
      <Prose doc={page.body} />
    </article>
  );
}
```

- [ ] **Step 3: Verify dynamic pages end to end (the headline feature)**

```bash
pnpm dev
```
- In admin, create + PUBLISH a page titled "About" (slug `about`) with body text.
- Visit `/about` → the page renders from the DB. No redeploy happened.
- Set the page back to DRAFT, save → `/about` now 404s.
- Visit `/team` → published team members render.
Stop the server.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/team" "src/app/(site)/[...slug]"
git commit -m "feat(public): team page and dynamic DB-driven pages"
```

---

### Task 22: Production build check + README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`** with setup steps

```markdown
# GYRsite

Tech company marketing site + built-in CMS (Next.js, Postgres/Prisma, Auth.js, Tailwind/shadcn, Tiptap).

## Local development

1. `pnpm install`
2. `docker compose up -d`        # start Postgres
3. `cp .env.example .env`        # then set AUTH_SECRET (pnpm dlx auth secret)
4. `pnpm prisma migrate dev`
5. `pnpm db:seed`                # creates the first admin user
6. `pnpm dev`

- Public site: http://localhost:3000
- CMS: http://localhost:3000/admin  (log in with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)

## Content model
Posts, Pages (published dynamically via a `[...slug]` route), Team members, Media (local-disk uploads under `public/uploads`).

## Notes
- Media storage is abstracted in `src/server/storage.ts` — swap for S3/R2 in production.
- No automated tests yet (deferred); helpers in `src/lib` and `src/server` are structured for later unit/e2e coverage.
```

- [ ] **Step 2: Full production build**

```bash
pnpm build
```
Expected: build succeeds with no type or lint errors. Fix any surfaced issues before committing. (If ESLint blocks the build on a minor rule, resolve the actual issue rather than disabling lint.)

- [ ] **Step 3: Smoke test the production server**

```bash
pnpm start
```
Visit `/`, `/blog`, `/team`, a published dynamic page, and `/admin` (redirects to login). Stop the server.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add README; verify production build"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Public marketing site (home/blog/team) → Tasks 19, 20, 21 ✓
- Built-in `/admin` CMS with CRUD for posts/pages/team/media → Tasks 13, 15, 16, 17 ✓
- Dynamic page publishing via `[...slug]` from DB → Task 21 ✓
- Postgres + Prisma, schema as specced → Tasks 4, 5 ✓
- Auth.js v5 credentials + hashed passwords + middleware gate + seed admin → Tasks 6, 7, 8, 9 ✓
- Tailwind + shadcn/ui → Tasks 1, 3 ✓
- Tiptap rich-text body stored as JSON, rendered on public site → Tasks 10, 11, 19 (Prose) ✓
- Media library: local disk + abstracted storage adapter + Media records → Task 12 ✓
- Zod validation shared logic → Tasks 14, 16, 17 ✓
- Slug auto-generation + uniqueness + reserved slugs → Tasks 10, 16, 21 ✓
- Roles exist (ADMIN/EDITOR); user-management UI deferred → schema Task 5, noted as future ✓
- Tests deferred per scope → no test harness tasks; structure kept testable ✓

**Placeholder scan:** No TBD/TODO; every code step contains complete code; commands have expected output.

**Type consistency:** `savePost(id, formData)` / `savePage` / `saveTeamMember` use the same `(id: string|null, formData)` shape and are `.bind(null, …)`-applied consistently; `RESERVED_SLUGS` defined in Task 10 and consumed in Tasks 16 & 21; `renderTiptap`/`tiptapExtensions`/`EMPTY_DOC` defined in Task 10 and consumed in Tasks 11, 16, 19; `listMedia` defined in Task 12 and consumed in Tasks 13, 15, 17; Prisma relation names (`PostCover`, `TeamPhoto`) consistent between schema and includes.

**Known version-sensitive steps (flagged for executor):** Tailwind v3 vs v4 typography plugin registration (Task 11 Step 2); `next/image` for local uploads (Task 13 Step 3). Both include the decision inline.
