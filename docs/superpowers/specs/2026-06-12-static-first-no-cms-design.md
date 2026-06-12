# Static-first GYR site — CMS removal (design)

**Date:** 2026-06-12
**Status:** Approved by Musa (chat, 2026-06-12)
**Decision:** Reverse the DB-driven CMS architecture. v1 ships as a pure static
bilingual brochure site. The CMS will be rebuilt later, incrementally, once
practice shows exactly which content parts change often enough to justify it.

## Why

- The CMS shipped fabricated demo content (fictional CTO, fake blog posts) that
  would fail the upcoming governance review.
- The dual-runtime Auth.js split, Prisma driver adapter, and upload API are a
  security/maintenance surface that currently serves no real content.
- Static prerendering is faster, cheaper, and easier to review formally.

## Scope

### Deleted

- `src/app/[locale]/admin/**`, `src/app/api/**`
- `src/app/[locale]/(site)/blog/**`, `(site)/team/**`, `(site)/[...slug]/**`
- `src/server/**`, `src/db/**`, `src/auth.ts`, `src/auth.config.ts`
- `src/components/admin/**`, `src/components/editor/**`,
  `src/components/site/prose.tsx`, and any `ui/` primitives only the admin used
- `src/lib/schemas/**`, tiptap helpers, `pick-localized` helper + test,
  `slugify` (only consumed by CMS/sitemap)
- `prisma/**`, `prisma.config.ts`
- Dependencies: `@prisma/client`, `@prisma/adapter-pg`, `pg`, `prisma`,
  `bcryptjs`, `next-auth`, `@tiptap/*`, `zod`, `tsx`, `vitest` (no tests left),
  and `db:*` package scripts
- Git history preserves all of it for the future CMS rebuild.

### Kept routes

| Route | Content |
|---|---|
| `/{en,ar}` | Home: hero, trust strip, capabilities, services, delivery, pillars, contact CTA. The DB-fed "Latest insights" section is dropped. |
| `/{en,ar}/about` | About: hero, mission, pillars, values, contact CTA. |

Nav (header + footer): About, Contact. Locale switcher + theme toggle unchanged.

## Architecture

- **Rendering:** no DB ⇒ remove `force-dynamic`. Both locales of both pages are
  statically prerendered at build time (`generateStaticParams` +
  `setRequestLocale` in each page). Deploy target stays a normal Next server
  (not `output: export`) so next-intl middleware keeps handling locale
  negotiation/redirects.
- **Middleware:** next-intl only; the Auth.js `authorized` gate disappears.
- **Content:** all copy in `messages/{en,ar}.json`. Structure enforces EN/AR
  parity (language-isolation policy stays guaranteed). Prune unused namespaces:
  `blog`, `team`, `admin`, `nav.insights`, `nav.team`, `nav.cms`,
  `home.insights*`, `seo.blog*`, `seo.team*`, `seo.pageDescription`.
- **SEO:** `sitemap.ts` becomes a static 4-URL map (2 routes × 2 locales) with
  hreflang alternates; `robots.ts` drops admin/api rules. All
  `createMetadata`/JSON-LD infrastructure is kept unchanged.
- **Env:** `DATABASE_URL`/`AUTH_*`/`SEED_*` become unused. `NEXT_PUBLIC_SITE_URL`
  remains required at deploy time for correct canonicals.

## Evolution path (CMS by practice)

When a copy section demonstrably changes often (e.g. a future Insights feed),
that catalog namespace is the unit that graduates to a DB table + admin form.
The catalogs therefore double as the requirements log for the CMS rebuild.

## Verification

`npx tsc --noEmit`, `pnpm lint`, `pnpm build` (expect all site routes to show
as ○ static), plus a `pnpm start` smoke test of `/en`, `/ar`, `/en/about`,
404 behavior, and absence of any DB connection attempt.
