# Bilingual (EN / AR) Internationalization — Design

**Date:** 2026-06-05
**Status:** Approved (design); pending implementation plan
**Scope:** Add English (`en`, LTR) and Arabic (`ar`, RTL) across the public site, the CMS-authored content, and the admin panel, with locale-prefixed routing and a language switcher button.

---

## 1. Goals & Non-Goals

### Goals
- Two locales: `en` (default, LTR) and `ar` (RTL).
- Locale-prefixed URLs for **every** route: `/en/...` and `/ar/...`. `/` redirects to `/en`.
- A language switcher button, always visible in the site header, that toggles locale while preserving the current path + query.
- Correct document direction (`dir="rtl"` / `"ltr"`) and locale-appropriate base font.
- Translatable: public UI chrome, CMS content (posts/pages/team), and the admin panel chrome.
- English is the fallback for any missing Arabic UI string or empty Arabic CMS field.

### Non-Goals
- No additional locales beyond `en`/`ar`.
- No machine translation — Arabic content is human-authored in the CMS.
- No broad automated test harness (the repo has none today); see §9.
- No redesign of existing visuals beyond what RTL and per-locale copy require.

---

## 2. Library & Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| i18n library | **next-intl** | De-facto App Router i18n; handles `[locale]` routing, middleware, message catalogs, navigation, and direction. |
| URL strategy | **`localePrefix: "always"`** | Every URL carries a locale (`/en`, `/ar`); cleanest for SEO + the CMS work. |
| Default locale | **`en`** | LTR default; `/` → `/en`. |
| CMS translation storage | **Sibling columns** (`titleAr`, `bodyAr`, …) | Least-churn, type-safe migration; existing columns remain the English/default value. |
| Shared slug | **One slug per entity** | Locale comes from the URL prefix; `/en/blog/x` and `/ar/blog/x` are the same record, different fields. |
| Switcher UI | **Two-state toggle button** | Only two locales; button shows the *target* language's native name (`العربية` ⇄ `English`). |
| Missing-translation behavior | **Fall back to `en`** | Applies to both UI keys and empty Arabic CMS fields. |

---

## 3. Architecture

### 3.1 App directory restructure

Routes move under a new dynamic `[locale]` segment. API routes stay at the app root (never localized).

```
src/app/
  layout.tsx            # thin passthrough — returns children only (no <html>)
  [locale]/
    layout.tsx          # owns <html lang dir>, fonts, NextIntlClientProvider
    (site)/             # moved from app/(site)
      layout.tsx
      page.tsx
      blog/page.tsx
      blog/[slug]/page.tsx
      team/page.tsx
      [...slug]/page.tsx
    admin/              # moved from app/admin
      ...
  api/                  # UNCHANGED — not localized
    auth/[...nextauth]/route.ts
    upload/route.ts
  globals.css
```

- `src/app/[locale]/layout.tsx` renders `<html lang={locale} dir={dir(locale)}>`, applies the font CSS variables, sets the base font (`font-arabic` when `ar`, Sora when `en`), and wraps children in `NextIntlClientProvider`. It validates the incoming `locale` param against the configured locales (calls `notFound()` otherwise).
- The root `src/app/layout.tsx` becomes a thin passthrough that returns `children`. The `metadata` export and font setup move into `[locale]/layout.tsx` (where direction/locale are known). The exact root/`[locale]` layout split follows the current next-intl App Router documentation, verified against the installed next-intl + Next 16 versions during implementation.

### 3.2 i18n module

```
src/i18n/
  routing.ts      # defineRouting({ locales: ["en","ar"], defaultLocale: "en", localePrefix: "always" }) + dir() helper
  navigation.ts   # createNavigation(routing) → Link, redirect, usePathname, useRouter, getPathname
  request.ts      # getRequestConfig — loads messages/<locale>.json, sets en fallback
messages/
  en.json
  ar.json
```

`dir(locale)` returns `"rtl"` for `ar`, else `"ltr"`.

### 3.3 Middleware composition (next-intl + Auth.js)

The existing `middleware.ts` runs only Auth.js. It becomes a composition of next-intl's `createMiddleware(routing)` and the Auth.js middleware, following the official next-intl "Auth.js" recipe:

- The intl middleware handles locale detection, `/` → `/en` redirects, and locale prefixing.
- Auth.js continues to gate `/[locale]/admin` (except `/[locale]/admin/login`).
- The `authorized` callback in `src/auth.config.ts` is updated to be **locale-aware**: strip a leading `/en` or `/ar` before testing `startsWith("/admin")` and the login-page check.
- The `matcher` is updated so intl runs on all pages while still excluding `api/auth`, `_next/static`, `_next/image`, and `favicon.ico`.
- Auth redirects (e.g. unauthenticated → login) target the locale-prefixed login path.

---

## 4. Public UI Translation, Switcher & RTL (Phase A + B)

### 4.1 String extraction
Every hardcoded user-facing string in these files moves into namespaced message keys:
- `src/components/site/site-header.tsx` — nav labels (`Insights`, `Team`), `CMS` link.
- `src/components/site/site-footer.tsx` — `NAVIGATE`, `PRINCIPLES`, link labels, taglines, copyright.
- `src/app/[locale]/(site)/page.tsx` — hero eyebrow, headings, body, CTA buttons, values strip, pillars (titles + descriptions), latest-insights section, closing band.
- `src/app/[locale]/(site)/blog/page.tsx` and `blog/[slug]/page.tsx` — headings, empty states, metadata labels.
- `src/app/[locale]/(site)/team/page.tsx` — headings, empty states.
- `src/components/site/page-header.tsx` — any static copy.
- `src/app/[locale]/(site)/[...slug]/page.tsx` — 404 / not-found copy.

Namespaces: `nav`, `footer`, `home`, `blog`, `team`, `common`.

### 4.2 Per-locale hero/pillars/footer copy
Today the hero, pillars, and footer render Arabic **and** English simultaneously as a stylistic device. In the i18n version, each locale renders **its own** primary copy (Arabic primary under `ar`, English primary under `en`). A single small opposite-language tagline flourish is retained as a brand touch. Embedded opposite-direction text keeps a local `dir` attribute.

### 4.3 Language switcher
- New client component `src/components/site/locale-switcher.tsx`.
- Two-state toggle: shows the **target** locale's native name (`العربية` when on `en`; `English` when on `ar`).
- Uses next-intl navigation (`usePathname` + `useRouter` from `src/i18n/navigation.ts`) to switch locale while preserving the current pathname + query string.
- Placed in the header, **always visible** (desktop and mobile), beside the CMS link.

### 4.4 RTL styling pass
- `dir="rtl"` on `<html>` auto-flips flex/grid/`space-x` ordering.
- Audit components for layout-affecting **physical** utilities and convert to **logical** equivalents (Tailwind v4): `ml/mr → ms/me`, `pl/pr → ps/pe`, `left/right → start/end`, `text-left/right → text-start/end`. Where a physical direction is intentional, use `rtl:`/`ltr:` variants.
- Remove now-redundant hardcoded `dir="rtl"` on Arabic spans that match the page direction; keep `dir` only for genuinely embedded opposite-direction snippets (e.g. the English flourish under `ar`, or the Arabic flourish under `en`).
- Direction-sensitive decorative gradients/underlines reviewed for both directions.

### 4.5 Localized metadata & SEO
- `generateMetadata` uses `getTranslations` for `title`/`description` per locale.
- `hreflang` alternates emitted for `en`/`ar` (enabled by prefix routing).

---

## 5. Bilingual CMS Content (Phase B)

### 5.1 Prisma schema changes
Add nullable Arabic sibling columns; existing columns remain English/default.

- `Post`: `titleAr String?`, `excerptAr String?`, `bodyAr Json?`
- `Page`: `titleAr String?`, `bodyAr Json?`
- `TeamMember`: `roleAr String?`, `bioAr String?`
- `slug` unchanged (shared across locales).

Migration is **non-destructive** (all new columns nullable). Existing rows keep their English content; Arabic is added via the admin over time.

### 5.2 Localized queries
- `src/server/public-content.ts` query functions take a `locale` argument: `getPublishedPosts(locale)`, `getPostBySlug(slug, locale)`, `getPageBySlug(slug, locale)`, `getNavPages(locale)`, `getPublishedTeam(locale)`.
- A pure helper `pickLocalized(en, ar, locale)` returns the Arabic value when `locale === "ar"` **and** the Arabic value is non-empty, otherwise the English value. Used to project each record into a locale-resolved shape before rendering.
- Callers (site header/footer, pages) pass the active locale (from `getLocale()` / route param).

### 5.3 Admin forms
- `src/components/admin/post-form.tsx`, `page-form.tsx`, `team-form.tsx`: add paired EN/AR inputs for each translatable field.
- The Arabic rich-text body uses a second Tiptap editor instance configured RTL (`src/components/editor/rich-text-editor.tsx` gains a `dir`/RTL option).
- Zod schemas (`src/lib/schemas/*.ts`) add the Arabic fields as **optional**.
- Server actions (`src/server/posts.ts`, `pages.ts`, `team.ts`) persist the Arabic columns.

### 5.4 Seed
`prisma/seed.ts` updated to populate Arabic fields for seeded content so both locales render out of the box.

---

## 6. Admin Panel Translation (Phase C)

- Admin chrome strings (sidebar labels, page titles, table headers, form labels, buttons, status text) → `admin` namespace in both catalogs.
- Files: `src/components/admin/sidebar.tsx`, admin page headers under `src/app/[locale]/admin/**`, form labels/buttons, `delete-button`, `logout-button`, login form.
- Admin renders RTL under `ar` (inherits document direction). The language switcher is available in the admin shell as well.

---

## 7. Edge Cases

- **Invalid locale** in URL → `notFound()` (404) via locale validation + middleware.
- **Empty Arabic CMS field** → English fallback via `pickLocalized`.
- **Missing Arabic UI key** → next-intl `en` fallback.
- **Auth redirects** preserve locale (`/[locale]/admin/login`).
- **Bookmarked unprefixed URLs** (`/blog`) → middleware redirects to the detected/default locale.
- **Mixed-direction text** (Latin inside Arabic or vice-versa) → local `dir` attributes on the embedded snippet.

---

## 8. Rollout Phases

All three phases are specified in this one document; each lands as an independently reviewable change set.

- **Phase A — Foundation:** install next-intl; `i18n/` module; app restructure under `[locale]`; middleware composition; `<html lang dir>` + fonts; message catalogs scaffolding; switcher.
- **Phase B — Public content & UI:** extract all public strings to catalogs; per-locale hero/pillars/footer; RTL pass; localized metadata/hreflang; Prisma Arabic columns + migration; localized public queries + `pickLocalized`; admin forms for Arabic fields; seed.
- **Phase C — Admin chrome:** translate admin UI strings; verify admin RTL.

> Note: schema/query/admin-form work (CMS bilingual) is grouped with Phase B because the public pages need localized content to be meaningful; Phase C is the admin chrome only.

---

## 9. Testing & Verification

The repository currently has **no test harness** (no test deps in `package.json`). Verification plan:

- **Build & types:** `next build` and TypeScript compilation must pass.
- **Targeted unit test:** add **vitest** solely for the pure `pickLocalized()` fallback helper (en/ar/empty cases). No broader test infrastructure (YAGNI).
- **Manual checks:**
  - `/` redirects to `/en`; `/en` and `/ar` render with correct `lang`/`dir` and base font.
  - Switcher toggles locale and preserves the current path + query.
  - RTL layout renders correctly on home, blog, team, and a CMS page.
  - Admin gating still works under locale prefixes; login redirect preserves locale.
  - A post/page/team member with Arabic fields renders Arabic under `/ar` and English under `/en`; empty Arabic falls back to English.

---

## 10. Affected Files (summary)

**New:** `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `messages/en.json`, `messages/ar.json`, `src/components/site/locale-switcher.tsx`, `src/app/[locale]/layout.tsx`, `src/lib/i18n/pick-localized.ts` (+ its vitest), Prisma migration.

**Moved:** `src/app/(site)/**` and `src/app/admin/**` → under `src/app/[locale]/`.

**Modified:** `src/app/layout.tsx` (→ passthrough), `middleware.ts`, `src/auth.config.ts`, `next.config.ts` (next-intl plugin), `package.json` (deps), `prisma/schema.prisma`, `prisma/seed.ts`, `src/server/public-content.ts`, `src/server/posts.ts`, `src/server/pages.ts`, `src/server/team.ts`, `src/lib/schemas/*.ts`, all `(site)` pages + `site-header`/`site-footer`/`page-header`, admin forms + sidebar + admin pages, `src/components/editor/rich-text-editor.tsx`.
