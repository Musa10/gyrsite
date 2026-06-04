# CMS-Controlled Coded Page Layouts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let custom-layout pages be hand-coded React routes whose nav presence, label, order, and visibility are controlled from the CMS admin via a new `customLayout` flag on the `Page` model.

**Architecture:** A coded page is two halves — a React route file under `src/app/(site)/<slug>/page.tsx` (Next.js serves explicit routes over the `[...slug]` catch-all) plus a `Page` DB record at the same slug. A new boolean `customLayout` marks records whose body is owned by code: the admin form hides the body editor for them, and the public catch-all 404s rather than rendering an empty body. The existing nav query already surfaces published `showInNav` pages, so coded pages flow into the menu with no nav code changes.

**Tech Stack:** Next.js 16 (App Router, RSC), Prisma 7 + `@prisma/adapter-pg` (PostgreSQL), Zod 4, TipTap 3, Tailwind 4, TypeScript.

**Testing note:** This project has no unit-test runner (no jest/vitest; `package.json` exposes only `lint`). Per-task verification therefore uses `npx tsc --noEmit` (type safety), Prisma CLI (migration state), and a final runtime smoke test against `npm run dev`. We are deliberately NOT adding a test framework for this small feature.

**Commit hygiene:** The working tree has unrelated uncommitted changes (`globals.css`, `layout.tsx`, untracked dirs). Every commit step below `git add`s only the exact files for that task — never `git add -A`.

---

### Task 1: Add `customLayout` to the Prisma schema + migration

**Files:**
- Modify: `prisma/schema.prisma` (the `model Page` block, around lines 47-58)

- [ ] **Step 1: Add the field to the `Page` model**

In `prisma/schema.prisma`, add one line to `model Page` (place it right after the `showInNav` / `navOrder` fields, before `createdAt`):

```prisma
model Page {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  body        Json
  status      Status    @default(DRAFT)
  publishedAt DateTime?
  showInNav   Boolean   @default(false)
  navOrder    Int       @default(0)
  customLayout Boolean  @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

- [ ] **Step 2: Create and apply the migration**

Run: `npx prisma migrate dev --name add_page_custom_layout`
Expected: a new folder `prisma/migrations/<timestamp>_add_page_custom_layout/` is created, the migration applies cleanly, and the Prisma client regenerates. Output ends with "Your database is now in sync with your schema." (or equivalent) and no errors.

- [ ] **Step 3: Verify the type reached the client**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0). The regenerated `Page` type now includes `customLayout: boolean`; nothing else changed, so the build stays clean.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(cms): add customLayout flag to Page model"
```

---

### Task 2: Accept `customLayout` in the page Zod schema

**Files:**
- Modify: `src/lib/schemas/page.ts`

- [ ] **Step 1: Add the field, mirroring `showInNav`**

Replace the contents of `src/lib/schemas/page.ts` with:

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
  customLayout: z.union([z.literal("on"), z.literal("")]).optional(),
});

export type PageInput = z.infer<typeof pageSchema>;
```

(`body` stays required — coded pages submit a serialized `EMPTY_DOC`, see Task 4, which is well over 2 chars, so this constraint is never hit.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 3: Commit**

```bash
git add src/lib/schemas/page.ts
git commit -m "feat(cms): accept customLayout in page schema"
```

---

### Task 3: Persist `customLayout` in `savePage`

**Files:**
- Modify: `src/server/pages.ts` (the `data` object in `savePage`, around lines 25-33)

- [ ] **Step 1: Add `customLayout` to the persisted data**

In `src/server/pages.ts`, inside `savePage`, update the `data` object to include the flag:

```ts
  const status = d.status;
  const data = {
    title: d.title,
    slug,
    body: JSON.parse(d.body),
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    showInNav: d.showInNav === "on",
    navOrder: d.navOrder ? parseInt(d.navOrder, 10) || 0 : 0,
    customLayout: d.customLayout === "on",
  };
```

Do NOT change the `RESERVED_SLUGS` check above it. Coded content slugs (e.g. `services`) must remain allowed; `RESERVED_SLUGS` stays limited to `admin`, `api`, `blog`, `team`.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0). `prisma.page.create/update` now accepts `customLayout` because the regenerated type includes it.

- [ ] **Step 3: Commit**

```bash
git add src/server/pages.ts
git commit -m "feat(cms): persist customLayout on save"
```

---

### Task 4: Create the `PageBodyField` client component

**Files:**
- Create: `src/components/admin/page-body-field.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/admin/page-body-field.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { EMPTY_DOC } from "@/lib/tiptap";
import { Label } from "@/components/ui/label";

export function PageBodyField({
  initialContent,
  initialCustomLayout,
}: {
  initialContent?: JSONContent;
  initialCustomLayout?: boolean;
}) {
  const [customLayout, setCustomLayout] = useState(
    initialCustomLayout ?? false
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          id="customLayout"
          name="customLayout"
          type="checkbox"
          checked={customLayout}
          onChange={(e) => setCustomLayout(e.target.checked)}
        />
        <Label htmlFor="customLayout">
          Custom-coded layout (no body editor)
        </Label>
      </div>

      {customLayout ? (
        <>
          <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            This page&apos;s layout is coded in React at{" "}
            <code className="font-mono">/&lt;slug&gt;</code>. This record only
            controls its title, nav label, order, and visibility.
          </p>
          <input type="hidden" name="body" value={JSON.stringify(EMPTY_DOC)} />
        </>
      ) : (
        <div className="space-y-2">
          <Label>Body</Label>
          <RichTextEditor name="body" initialContent={initialContent} />
        </div>
      )}
    </div>
  );
}
```

The ternary guarantees exactly one `name="body"` input exists at submit time (the hidden `EMPTY_DOC` input when coded, or the editor's own hidden input when not), so the form always posts a schema-valid `body`.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/page-body-field.tsx
git commit -m "feat(cms): add PageBodyField with custom-layout toggle"
```

---

### Task 5: Wire `PageBodyField` into `PageForm`

**Files:**
- Modify: `src/components/admin/page-form.tsx`

- [ ] **Step 1: Swap the body block and extend the `initial` type**

Replace the contents of `src/components/admin/page-form.tsx` with:

```tsx
import { PageBodyField } from "@/components/admin/page-body-field";
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
    customLayout: boolean;
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
      <PageBodyField
        initialContent={initial?.body}
        initialCustomLayout={initial?.customLayout}
      />
      <div className="flex items-center gap-2">
        <input
          id="showInNav"
          name="showInNav"
          type="checkbox"
          defaultChecked={initial?.showInNav}
        />
        <Label htmlFor="showInNav">Show in navigation</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="navOrder">Nav order</Label>
        <Input
          id="navOrder"
          name="navOrder"
          type="number"
          defaultValue={initial?.navOrder ?? 0}
          className="w-32"
        />
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

Key changes: import `PageBodyField` instead of `RichTextEditor`, replace the old `Body` label + `RichTextEditor` block with `<PageBodyField />`, and add `customLayout: boolean` to the `initial` prop type.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0). Note: the `new` page (`src/app/admin/pages/new/page.tsx`) calls `<PageForm action={action} />` with no `initial`, which is still valid because `initial` is optional.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/page-form.tsx
git commit -m "feat(cms): use PageBodyField in the page form"
```

---

### Task 6: Pass `customLayout` from the edit page into the form

**Files:**
- Modify: `src/app/admin/pages/[id]/edit/page.tsx` (the `initial` object, around lines 26-33)

- [ ] **Step 1: Add `customLayout` to `initial`**

In `src/app/admin/pages/[id]/edit/page.tsx`, extend the `initial` object passed to `<PageForm>`:

```tsx
      <PageForm
        action={action}
        initial={{
          title: page.title,
          slug: page.slug,
          body: (page.body as JSONContent) ?? EMPTY_DOC,
          status: page.status,
          showInNav: page.showInNav,
          navOrder: page.navOrder,
          customLayout: page.customLayout,
        }}
      />
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0). With Task 5's type now requiring `customLayout`, omitting this line would be a type error — confirming the wiring.

- [ ] **Step 3: Commit**

```bash
git add "src/app/admin/pages/[id]/edit/page.tsx"
git commit -m "feat(cms): pass customLayout into the edit form"
```

---

### Task 7: Guard the public catch-all against coded-page bodies

**Files:**
- Modify: `src/app/(site)/[...slug]/page.tsx` (the `DynamicPage` function, around lines 27-29)

- [ ] **Step 1: Add the guard**

In `src/app/(site)/[...slug]/page.tsx`, inside `DynamicPage`, add a guard immediately after the existing `if (!page) notFound();`:

```tsx
  const page = await getPageBySlug(joined);
  if (!page) notFound();
  // Coded pages own their path via an explicit React route; never render their
  // (empty) body through the document renderer. 404 until the coded route exists.
  if (page.customLayout) notFound();
```

`getPageBySlug` does a `findFirst` with no `select`, so `page.customLayout` is present on the returned object — no query change needed.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/[...slug]/page.tsx"
git commit -m "feat(cms): 404 catch-all for customLayout pages"
```

---

### Task 8: Show a "Coded" badge in the admin pages list

**Files:**
- Modify: `src/app/admin/pages/page.tsx` (the title `TableCell`, around line 41)

- [ ] **Step 1: Add the badge to the title cell**

In `src/app/admin/pages/page.tsx`, replace the title cell:

```tsx
              <TableCell>{p.title}</TableCell>
```

with:

```tsx
              <TableCell>
                {p.title}
                {p.customLayout && (
                  <Badge variant="secondary" className="ml-2">
                    Coded
                  </Badge>
                )}
              </TableCell>
```

`Badge` is already imported in this file (used for the status column), and `secondary` is a known variant — no new imports.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 3: Commit**

```bash
git add "src/app/admin/pages/page.tsx"
git commit -m "feat(cms): badge coded pages in the admin list"
```

---

### Task 9: Runtime smoke test (manual, no commit)

This replaces an automated test suite. Perform it once after Tasks 1-8.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server starts on http://localhost:3000 with no compile errors.

- [ ] **Step 2: Document page still works (regression)**

In a browser: log in at `/admin/login`, create a Page with **Custom-coded layout OFF**, write some body text, set Published + Show in nav, save. Visit its `/<slug>` URL.
Expected: renders as a normal article (title + prose body); appears in the top nav.

- [ ] **Step 3: Coded page record with no route → 404**

Create a Page with **Custom-coded layout ON**, slug `services`, Published + Show in nav, save. Confirm the admin form hid the body editor and showed the note, and the list shows a "Coded" badge. Visit `/services`.
Expected: the page appears in the top nav (label = title), but `/services` returns 404 (no coded route built yet) — proving the Task 7 guard.

- [ ] **Step 4: Add the coded route → it renders**

Create a minimal `src/app/(site)/services/page.tsx`:

```tsx
export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Services</h1>
      <p className="mt-4 text-muted-foreground">Coded services page.</p>
    </section>
  );
}
```

Reload `/services`.
Expected: the coded React UI renders (not the document renderer); the nav link still points here. This confirms the full coded-page flow.

- [ ] **Step 5: Visibility control without code**

In admin, edit the `services` Page and untick **Show in navigation** (or set Draft), save.
Expected: the link disappears from the top nav while `/services` still renders the coded UI directly. This confirms CMS-controlled visibility.

- [ ] **Step 6: Commit the example route (optional)**

If you want to keep the `/services` example as a starting point:

```bash
git add "src/app/(site)/services/page.tsx"
git commit -m "feat(site): add example coded services page"
```

Otherwise delete it: `rm "src/app/(site)/services/page.tsx"`.

---

## Self-Review

**Spec coverage:**
- Data model `customLayout` field + migration → Task 1. ✓
- Zod schema → Task 2. ✓
- `savePage` persistence + no reserved-slug change → Task 3. ✓
- Admin form hides body editor + note + valid empty body → Tasks 4-5. ✓
- Edit page passes the flag → Task 6. ✓
- Catch-all guard / 404 behavior → Task 7. ✓
- "Coded" badge in list (minor) → Task 8. ✓
- No nav/`getNavPages`/`site-header` change → confirmed in Task 7 note; nothing to do. ✓
- Workflow + 404-when-no-route + visibility-without-code → verified in Task 9. ✓
- Out of scope (blog/team migration, block builder, inline images) → not touched. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code; every command shows expected output.

**Type consistency:** `customLayout` used identically everywhere — `Boolean @default(false)` (Prisma) → `customLayout: boolean` (client type) → `z.union([z.literal("on"), z.literal("")])` form value → `d.customLayout === "on"` coercion. `PageBodyField` prop names (`initialContent`, `initialCustomLayout`) match their use in Task 5. `PageForm` `initial.customLayout: boolean` matches the value passed in Task 6.
