# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package manager: pnpm only — never npm

This repo uses **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`, and a `.pnpm/` store under `node_modules`). **Do not run `npm install` / `npm ci`** — npm cannot reconcile pnpm's symlinked store and crashes with `Cannot read properties of null (reading 'matches')` (an arborist dedupe bug). Always use `pnpm add` / `pnpm add -D` / `pnpm install`.

## Commands

- `pnpm dev` — run the site locally
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint (`eslint-config-next`)
- `npx tsc --noEmit` — typecheck (the primary correctness gate)

There is **no test harness.** Verification is `npx tsc --noEmit` + `pnpm build` (all site routes must prerender statically) + manual checks via `pnpm dev`.

## Architecture: fully static bilingual brochure site

**There is no CMS, no database, no auth.** The previous Prisma/Auth.js/Tiptap CMS was deliberately removed (2026-06-12) — see `docs/superpowers/specs/2026-06-12-static-first-no-cms-design.md`. The plan is to rebuild a CMS later, incrementally, once practice shows which content actually needs to be editable. Do not reintroduce DB/auth dependencies for content work; git history holds the old CMS for reference.

**Routes** (all statically prerendered, both locales):
- `/{en,ar}` — Home (`src/app/[locale]/(site)/page.tsx`)
- `/{en,ar}/about` — About

**Content lives in `messages/{en,ar}.json`.** To change visible copy, edit the catalogs — never hardcode strings in JSX. The catalog structure enforces EN/AR parity. When a section needs to change often enough that catalog edits hurt, that namespace is the candidate for the future CMS.

**i18n (next-intl):** `src/i18n/{routing,navigation,request}.ts`; `localePrefix: "always"`. Use the locale-aware `Link` from `@/i18n/navigation`, not `next/link`. `middleware.ts` is next-intl only. Every layout/page calls `setRequestLocale(locale)` so static rendering works.

**Language isolation policy (user directive):** Arabic and English must never be mixed in one rendered page. The only exception is the locale switcher label, wrapped in `<span lang="ar" dir="rtl">`. An unlayered rule in `globals.css` (`[lang="ar"] .font-display, .font-display [lang="ar"]`) swaps display type to IBM Plex Sans Arabic and zeroes letter-spacing — Space Grotesk has no Arabic glyphs and tracking breaks Arabic letter-joining. Don't add per-component `locale === "ar"` font conditionals.

**SEO:** `src/lib/seo.ts` centralizes `siteConfig`, canonical/hreflang alternates (`createMetadata`), and JSON-LD builders; `src/app/{sitemap,robots}.ts` are static. **`NEXT_PUBLIC_SITE_URL` must be set at deploy time** or every canonical/sitemap URL emits `http://localhost:3000`.

**Brand:** Swiss monochrome, light default (`globals.css` ramp; `.dark` inversion). Inline-SVG `FalconMark`/`Logo` in `src/components/site/brand/` use `currentColor` and tightly-cropped viewBoxes — size with a height utility + `w-auto`. Display font Space Grotesk, body Inter, Arabic IBM Plex Sans Arabic (weights 400–700).

**Layering:** `src/components/site/` (public components), `src/lib/seo.ts` (pure helpers), `src/i18n/`. Path alias `@/*` → `src/*`.

## Content governance

The site is formally reviewed. Never add factual claims (clients, certifications, team members, contact channels) without explicit user confirmation. The contact email in `siteConfig` (`contact@gyr.ae`) is the single contact channel — confirm mailbox ownership before changing it.
