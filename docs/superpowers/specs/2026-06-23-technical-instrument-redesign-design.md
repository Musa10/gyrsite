# Design Spec — Technical-Instrument Redesign

**Date:** 2026-06-23
**Status:** Approved for planning (design only; content deferred)
**Supersedes (visually):** the monochrome rebrand of 2026-06-06 and the static-first structure of 2026-06-12 — this keeps the static-first architecture and replaces the *visual language* and *page set*.

---

## 1. Why

The current site is a competent Swiss-monochrome brochure, but it reads as machine-generated: a centered hero with eyebrow + heading + two buttons, three-column feature-card grids, a "Connect. Innovate. Elevate." triad, gray-on-gray body text, and a textbook marketing section sequence (hero → trust strip → caps → services → delivery → pillars → CTA). Each element is a safe default; stacked together they signal "templated."

The redesign replaces that with a **technical-instrument** aesthetic: the site looks like the precise, annotated systems GYR builds. Distinction comes from type, density, structure, and detail craft — **not** from decoration or color. This direction earns its creativity by resembling the work, which keeps it credible for a serious enterprise audience.

## 2. What changes / what holds

**Changes:** visual language (type, ramp, components, motion), the page set (2 → 5 pages), the positioning, and the introduction of a named founder presence.

**Holds (hard constraints, unchanged):**
- Fully static, bilingual brochure site. **No CMS, DB, or auth.** Content in `messages/{en,ar}.json`. (`CLAUDE.md`)
- **pnpm only.** Verification = `npx tsc --noEmit` + `pnpm build` (all routes must prerender statically) + manual `pnpm dev`.
- **EN/AR language isolation** — Arabic and English never mixed on one rendered page (only exception: the locale-switcher label). next-intl, `localePrefix: "always"`, locale-aware `Link` from `@/i18n/navigation`, `setRequestLocale` in every page/layout.
- **Falcon mark** stays inline-SVG, `currentColor`, tightly-cropped viewBox (`FALCON_PATH` in `src/components/site/brand/falcon.tsx`). It is a logo — never recolored, never mirrored.
- **SEO** stays centralized in `src/lib/seo.ts`; `NEXT_PUBLIC_SITE_URL` required at deploy.
- **Content governance** — no factual claim ships without explicit user approval. See §9.

## 3. Positioning (framing, not factual claims)

- Identity broadens from "AI software for financial institutions" to a **broad-enterprise AI automation + cybersecurity** company. Industries (finance, government, healthcare, logistics, energy, …) are *sectors served*, shown as a quiet list — **the specific list is content-pass / user-confirmed, not asserted here.**
- Two capability pillars: **AI Automation** and **Cybersecurity**.
- **Founder-forward:** Sultan Alowais appears on Home (signed note), About (full profile), and Contact (direct line). His bio, title, and photo are **factual content the user must provide and approve** — until then, a visibly-flagged placeholder.

## 4. Design direction: pure (warm) monochrome instrument

### 4.1 Color ramp — warm ink-on-paper

Shift the neutral ramp from the current **cold zinc (hue ~240)** to a **warm ink-on-paper (hue ~40, very low saturation)**. Still monochrome; warmth sheds the clinical-AI chill while keeping the discipline. Color remains reserved for functional UI states only (destructive / success / warning), unchanged.

Representative starting values (HSL; final values tuned in build against WCAG AA, preserving the existing contrast notes in `globals.css`):

| Token | Light (paper) | Dark (inverted) |
|---|---|---|
| `--background` | `40 24% 96%` (~#f6f4ef) | `40 8% 6%` (~#110f0c) |
| `--foreground` | `45 18% 8%` (~#17150f ink) | `40 18% 95%` |
| `--ink-2` (secondary text) | `42 8% 38%` | `40 10% 82%` |
| `--surface` | `40 22% 92%` | `40 7% 10%` |
| `--border` (hairline) | `42 16% 82%` (~#d8d3c8) | `40 6% 18%` |
| `--muted-foreground` | `42 7% 44%` (AA on surface) | `40 8% 64%` |

Dark mode stays a pure inversion of the same ramp (existing `.dark` mechanism + pre-paint init script kept as-is).

### 4.2 Typography

| Role | Face | Notes |
|---|---|---|
| Display | **Space Grotesk** (500/600/700) | Headlines, tight `-0.02em` tracking. Existing. |
| Body | **Inter** (400/500) | Paragraphs. Existing. |
| **Instrument / mono** | **IBM Plex Mono** (400/500/600) | **NEW.** Section labels, annotations, metadata, tags, the readout/spec-sheet tokens. This is the signature of the aesthetic. |
| Arabic (all roles) | **IBM Plex Sans Arabic** (400–700) | Existing. See §8 for how it carries the "mono/instrument" role in AR. |

Type scale (starting): hero headline 44–48px · page headers 34–40px · section headings 20–24px · body 14–15px · mono labels 10–11px tracked `.14–.22em`. Loaded via `next/font/google` in `[locale]/layout.tsx` (add Plex Mono with a `--font-plex-mono` variable; keep weight sets minimal for payload).

### 4.3 The instrument component kit

A small, reusable vocabulary applied across all pages (built under `src/components/site/`):

- **Section label** — `§0X — NAME` in tracked mono (replaces generic eyebrows).
- **Spec-sheet header** — margin metadata column (`DOC / REV / CLASS / ORIGIN`) + oversized headline + hairline rule + standfirst. Used for the hero and every page header.
- **Calibrated falcon stage** — the falcon mark centered on a registration crosshair with a dimension line and mono annotations (`FIG.01`, `FALCON / STOOP`). The hero's right zone; reusable as a sectional motif.
- **Index table** — numbered, tagged rows (`01 · name · descriptor · TAG`) with hairline separators. Replaces card grids for lists of services/capabilities.
- **Process sequence** — horizontal/vertical step nodes (dot + connector rail + mono step number + caption) for Define→Design→Build→Operate.
- **Capability block** — two-up subsystem layout with mono sub-lists (for AI Automation / Cybersecurity).
- **Founder note / profile** — signed statement (Home) and full profile (About): portrait slot, quote/bio, signature, role, LinkedIn.
- **Hairline primitives** — rules, ambient hairline grid (keep `bg-grid`), registration crosshairs, brand-tick.
- **Footer** — mono multi-column (navigate / contact / principles).

### 4.4 Motion

Restrained and mechanical. Keep the existing `fade-up` entrance and `prefers-reduced-motion` guard. Permit sparing instrument flourishes (e.g. a one-shot caret blink or a falcon path "draw-in" on the hero) — never looping decoration. Monochrome restraint governs motion too.

### 4.5 Hero (locked)

**Spec-sheet layout + calibrated falcon.** Three-zone grid: (1) left margin metadata column, (2) center headline + hairline + standfirst + mono text link, (3) right calibrated-falcon stage. Mirrors for RTL (§8). This is the agreed direction from the visual brainstorm.

## 5. Information architecture (approved)

Five pages, both locales, all statically prerendered. Routes added under `src/app/[locale]/(site)/`. Header nav: `AUTOMATION · SECURITY · APPROACH · ABOUT · CONTACT` + locale switcher. Every section below is a **content slot** — copy authored in the later content pass (§9).

### Home `/`
1. Hero (spec-sheet + calibrated falcon)
2. **§01 Capabilities** — AI Automation + Cybersecurity, two-up with mono sub-lists
3. **§02 What we build** — service lanes as an annotated index table
4. **§03 Approach** — Define→Design→Build→Operate sequence (links to /approach)
5. **§04 From the founder** — Sultan's signed note (portrait + quote + signature + LinkedIn) *(needs approved bio/photo)*
6. **§05 Sectors** — quiet mono row of industries *(list user-confirmed)*
7. **§06 Contact** — engagement close + email channel
8. Footer

### Services / Capabilities `/services`
Header · §01 AI Automation (expanded: definition, sub-capability index, application) · §02 Cybersecurity (expanded) · §03 detailed build index · §04 contact CTA.

### Approach / Method `/approach`
Header · §01 Define→Design→Build→Operate, each step expanded (activities, controls, output) · §02 governance/security posture · §03 principles (Connect·Innovate·Elevate or revised) · §04 contact CTA.

### About `/about`
Header · §01 company statement · §02 **full founder profile** (large portrait, full bio, role, LinkedIn) *(needs approved bio/photo)* · §03 values · §04 contact CTA.

### Contact `/contact`
Header · §01 direct channel (`contact@gyr.ae` + "reach the founder directly") · §02 what-to-include guidance · §03 channel details (email, location, LinkedIn).
**No backend.** Contact uses a `mailto:` link with a pre-filled subject — no form service, nothing to host. (Decided.)

## 6. Codebase mapping

- **`src/app/globals.css`** — replace the cold-zinc ramp with the warm ink-on-paper ramp (§4.1); extend the instrument component utilities (registration crosshair, dimension line, index-table, process-sequence, mono-label helpers) alongside existing `bg-grid` / `brand-card` / `brand-tick`. Keep the unlayered `[lang="ar"] .font-display` rule and extend the same principle to mono labels (§8).
- **`src/app/[locale]/layout.tsx`** — add IBM Plex Mono via `next/font/google` (`--font-plex-mono`); register it in `@theme` as `--font-mono`.
- **`src/components/site/`** — add the kit components (§4.3); rework `hero`, `site-header`, `site-footer`, `section-heading`, `contact-cta`, `trust-strip` → instrument equivalents. Keep brand components (`falcon`, `logo`) as-is.
- **Routes** — add `(site)/services`, `(site)/approach`, `(site)/contact` pages; rework existing `(site)/page.tsx` (Home) and `(site)/about/page.tsx`. Each calls `setRequestLocale`, exports `generateMetadata` via `createMetadata`, emits appropriate JSON-LD/breadcrumbs.
- **`messages/{en,ar}.json`** — restructure into per-page namespaces matching §5 section slots. **Placeholder values only** during the design build (clearly marked, dev-only); real copy lands in the content pass. EN/AR key parity maintained.
- **`src/app/sitemap.ts`** + nav — add the three new routes for both locales.
- **`src/lib/seo.ts`** — unchanged mechanics; new pages reuse `createMetadata` / `breadcrumbJsonLd`. Update `siteConfig` description framing only if user approves (factual).

## 7. SEO

Per-page `generateMetadata` with canonical + hreflang alternates (incl. `x-default`) via existing helpers. Breadcrumb JSON-LD on inner pages; Organization + WebSite JSON-LD on Home. All five routes in the sitemap, both locales.

## 8. i18n & RTL (instrument aesthetic in Arabic)

The instrument look is Latin-centric (mono tokens, `§`, `FIG.01`, `> contact@gyr.ae`). This must not break Arabic or the language-isolation policy:

- **Mono/instrument role in AR:** IBM Plex Mono has no Arabic glyphs. In Arabic, instrument labels render in **IBM Plex Sans Arabic with `letter-spacing: 0`** (extend the existing unlayered `[lang="ar"]` rule to mono labels). Latin mono is used only on EN pages.
- **Localize the tokens:** `DOC / REV / CLASS`, `§01 — CAPABILITIES`, `FIG.01`, annotations, and the contact prompt all get Arabic equivalents in the catalog. No script-mixing on a page.
- **Numerals:** recommend **Western Arabic numerals (0–9) on both locales** for instrument consistency; using Eastern Arabic numerals in AR is an option to confirm in the content pass. (Flagged, not decided.)
- **RTL mirroring:** spec-sheet layouts use logical properties so the metadata margin and calibrated-falcon stage mirror correctly (margin trails, stage leads on the start side). **The falcon mark itself is not mirrored** (logo integrity); only the layout flips. `dir(locale)` already drives `dir` on `<html>`.

## 9. Content governance & the deferred content pass

**This spec authors no factual content.** Every section in §5 is a slot. Before any production deploy, a **separate, user-reviewed content pass** must:

- Confirm the **capabilities** sub-lists (the actual AI-automation and cybersecurity services GYR offers).
- Confirm the **sectors** list.
- Confirm **location** and any **metrics/clients** (none asserted by default).
- Supply and approve **Sultan Alowais's** name (+ Arabic spelling), title, bio, and photo.
- Approve final framing copy and the `siteConfig` description.

During the design build, catalogs carry **clearly-marked placeholder strings** so the site renders and `pnpm build` stays green. Placeholders are **dev-only**; **the site is not to be deployed to production until the content pass is approved.** Factual-looking placeholders carry a visible flag in-UI where practical.

## 10. Verification

- `npx tsc --noEmit` clean.
- `pnpm build` — all 5 routes × 2 locales prerender statically (10 routes), no dynamic server work.
- `pnpm lint` clean.
- Manual `pnpm dev`: EN and AR render with correct fonts, no script-mixing; light/dark inversion clean with no flash; RTL mirrors layout but not the falcon; mailto opens with subject; reduced-motion respected.

## 11. Open items (carried to the content pass, not blockers for design build)

- Founder bio / title / photo / Arabic name spelling.
- Final capability sub-lists, sector list, location.
- Numerals choice in AR (Western vs Eastern).
- Final framing copy and `siteConfig` description wording.

## 12. Out of scope

Reintroducing a CMS/DB/auth; any contact backend/form service; new brand marks or recoloring the falcon; analytics; blog/insights; case studies or client logos.
