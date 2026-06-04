# CMS-Controlled Coded Page Layouts — Design

**Date:** 2026-06-04
**Status:** Approved (pending spec review)

## Problem

Different pages on the GYR site need different UIs. The current CMS uses a single
document model: every page created in the admin renders through the `[...slug]`
catch-all as a uniform article (title + Tiptap body styled with `.prose`). That is
correct for text pages (About, Privacy) but cannot express custom layouts
(home, services, landing pages).

We want custom-layout pages to be **coded by hand in React**, while their presence
in the site navigation — label, order, visibility — is **controlled from the CMS
admin UI**, with no code edit required to add or hide a menu item.

## Chosen Approach

A custom-layout page has two halves:

1. **The UI** — a hand-written React route file, e.g. `src/app/(site)/services/page.tsx`.
   Next.js App Router serves an explicit route in preference to the `[...slug]`
   catch-all, so visiting `/services` renders this file, not the CMS document
   renderer.
2. **A `Page` record in the CMS** — same slug (`services`), carrying title, nav
   order, "show in nav", and Draft/Published status. The existing nav query
   (`getNavPages`) already returns published Pages flagged `showInNav`, so this
   record is what places the coded page in the menu and controls its visibility.

To remove the one confusing aspect — that such a record still shows a body editor
that never renders — we add a **`customLayout` boolean** to the `Page` model. When
set, the admin form hides the body editor and the public catch-all refuses to
render the record's body (the coded route owns that path).

### Why this over the alternatives

- **Convention-only (no schema change):** works today (create a Page, leave body
  blank, coded route wins) but the admin stays confusing — a dead body editor and
  no signal which pages are coded. Rejected for clarity.
- **Central nav config file / hardcoded header links:** simpler code, but the user
  wants nav control from the admin UI without code edits. Rejected.

## Data Model

`prisma/schema.prisma` — add to `model Page`:

```prisma
customLayout Boolean @default(false)
```

Generate a migration with `prisma migrate dev`. Default `false` means all existing
pages are unaffected (they remain document-rendered).

## Changes by File

1. **`prisma/schema.prisma`** — add `customLayout Boolean @default(false)` to `Page`;
   run `npx prisma migrate dev` to create + apply the migration.

2. **`src/lib/schemas/page.ts`** — add `customLayout` to `pageSchema`, mirroring the
   existing `showInNav` checkbox handling:
   `customLayout: z.union([z.literal("on"), z.literal("")]).optional()`.
   The `body` field stays `z.string().min(2)` (see form note below — coded pages
   still submit a valid empty document, so this constraint is never violated).

3. **`src/server/pages.ts`** (`savePage`) — persist the flag in the `data` object:
   `customLayout: d.customLayout === "on"`. No change to the reserved-slug check:
   coded content slugs (e.g. `services`) are **not** added to `RESERVED_SLUGS`, so
   the Page record is allowed; `RESERVED_SLUGS` stays limited to framework/index
   routes (`admin`, `api`, `blog`, `team`).

4. **New client component `src/components/admin/page-body-field.tsx`** (`"use client"`)
   — owns the body region of the form. Renders:
   - a **"Custom-coded layout"** checkbox (`name="customLayout"`),
   - when **unchecked**: the existing `<RichTextEditor name="body" />`,
   - when **checked**: the editor is hidden and replaced by an explanatory note
     ("This page's layout is coded at `/<slug>`. This record only controls its
     title, nav label, order, and visibility.") plus a hidden
     `<input name="body">` holding `JSON.stringify(EMPTY_DOC)` so the form always
     submits a schema-valid body.
   It accepts `initialContent` and `initialCustomLayout` props and toggles on the
   checkbox's client state.

5. **`src/components/admin/page-form.tsx`** — replace the inline `Body` label +
   `<RichTextEditor>` with `<PageBodyField initialContent={initial?.body}
   initialCustomLayout={initial?.customLayout} />`. Extend the `initial` prop type
   with `customLayout?: boolean`. The `showInNav`, `navOrder`, and `status` fields
   are unchanged.

6. **`src/app/admin/pages/[id]/edit/page.tsx`** — pass `customLayout: page.customLayout`
   into the form's `initial` object.

7. **`src/app/(site)/[...slug]/page.tsx`** — after `getPageBySlug`, add a guard:
   `if (page.customLayout) notFound();`. This means even if no coded route exists
   yet (or for any direct catch-all hit), a coded page's empty body is never
   rendered as a blank article; the path 404s until the coded route is built.

8. **`src/app/admin/pages/page.tsx`** (list view, minor) — show a small "Coded"
   badge next to pages where `customLayout` is true, so editors can tell coded
   pages apart from document pages at a glance.

No change needed to `getNavPages` / `src/components/site/site-header.tsx`: coded
pages are ordinary published `showInNav` Pages and already flow into the nav.

## Workflow: adding a new coded page

1. Create `src/app/(site)/<slug>/page.tsx` with the custom React UI (and its own
   `generateMetadata` if SEO control is wanted).
2. In the admin, create a Page: set the title, set slug = `<slug>`, tick
   **Custom-coded layout**, tick **Show in navigation** + set order, set status to
   **Published**.
3. Result: `/​<slug>` renders the coded UI, and the page appears in the top nav with
   the title/order from the record. Unticking "show in nav" or setting Draft hides
   it from the menu — no code edit.

## Out of Scope

- Migrating the existing hardcoded `/blog` and `/team` header links into this
  CMS-controlled mechanism. They stay hardcoded in `site-header.tsx` for now.
- A visual section/block builder. Custom layouts remain hand-coded React.
- Inline images inside CMS document bodies.

## Testing / Verification

- `npx prisma migrate dev` applies cleanly; `npx tsc --noEmit` passes.
- Create a document page (customLayout off) → renders via catch-all as before.
- Create a coded page record (customLayout on) with a matching coded route →
  `/<slug>` renders the coded UI; the page shows in nav; the admin form hides the
  body editor.
- Coded page record with **no** coded route → `/<slug>` returns 404 (guard works).
- Toggling Draft / "show in nav" adds/removes the nav link without a code change.
