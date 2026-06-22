# Technical-Instrument Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the bilingual static site in a pure warm-monochrome "technical instrument" visual language, broaden positioning to AI-automation + cybersecurity, grow from 2 to 5 pages, and add a founder-forward presence — authoring structure and the visual system only, with all factual content as flagged placeholders.

**Architecture:** A small reusable "instrument component kit" (section labels, spec-sheet header, calibrated-falcon stage, index table, process sequence, capability block, founder blocks) composed into 5 statically-prerendered pages × 2 locales. The warm-mono ramp + a new IBM Plex Mono face live in `globals.css` / the locale layout. Copy stays in `messages/{en,ar}.json` as placeholders.

**Tech Stack:** Next.js 16 (App Router, React 19), next-intl, Tailwind v4 (`@theme` CSS-first), `next/font/google`. No DB/auth/CMS. pnpm.

**Reference:** Approved spec `docs/superpowers/specs/2026-06-23-technical-instrument-redesign-design.md`. Visual source of truth: mockups in `.superpowers/brainstorm/1787-1782168691/content/` (`home-structure.html`, `pages-structure.html`, `falcon-hero.html`).

## Global Constraints

Every task implicitly includes these:

- **Package manager: pnpm only.** Never `npm`. New dep this build: `@fontsource`-style not used — fonts via `next/font/google` (no install needed).
- **No test harness.** Per-task verification = `npx tsc --noEmit` (primary gate) + `pnpm lint` + `pnpm build` (all routes must prerender statically) on page/route tasks + manual `pnpm dev` visual check. There are no unit tests; do not invent a framework.
- **i18n:** `localePrefix: "always"`; every page/layout calls `setRequestLocale(locale)`; use `Link` from `@/i18n/navigation` (never `next/link`) for internal nav; all visible copy via `getTranslations` from `messages/{en,ar}.json` — never hardcode strings in JSX.
- **EN/AR parity & isolation:** every catalog key exists in both `en.json` and `ar.json`; never mix scripts on one rendered page; Arabic instrument labels use IBM Plex Sans Arabic with `letter-spacing:0` (the unlayered `[lang="ar"]` rule), never IBM Plex Mono.
- **Falcon mark** (`FALCON_PATH` in `src/components/site/brand/falcon.tsx`): inline SVG, `currentColor`, never recolored, **never mirrored** (even in RTL).
- **Content governance:** author NO factual claims. Capability sub-lists, sectors, location, metrics, and the founder bio/photo/title are placeholders flagged in-catalog and (where practical) in-UI. **The site is not to be deployed to production until the separate content pass is approved.**
- **SEO:** new pages use `createMetadata` / `breadcrumbJsonLd` from `src/lib/seo.ts`; add every route to `sitemap.ts`.
- **Path alias** `@/*` → `src/*`. Components live in `src/components/site/`.

---

## File Structure

**Create:**
- `src/components/site/instrument/section-label.tsx` — `§0X — NAME` mono label
- `src/components/site/instrument/spec-header.tsx` — spec-sheet page/hero header (metadata margin + headline + rule + standfirst)
- `src/components/site/instrument/calibrated-falcon.tsx` — falcon on crosshair stage with dimension line + annotations
- `src/components/site/instrument/index-table.tsx` — numbered/tagged annotated rows
- `src/components/site/instrument/process-sequence.tsx` — Define→Design→Build→Operate step nodes
- `src/components/site/instrument/capability-block.tsx` — two-up subsystem block with mono sub-list
- `src/components/site/founder-note.tsx` — Home signed note
- `src/components/site/founder-profile.tsx` — About full profile
- `src/components/site/contact-panel.tsx` — mailto channel + guidance
- `src/app/[locale]/(site)/services/page.tsx`
- `src/app/[locale]/(site)/approach/page.tsx`
- `src/app/[locale]/(site)/contact/page.tsx`

**Modify:**
- `src/app/globals.css` — warm-mono ramp, `--font-mono`, instrument utilities, AR mono rule
- `src/app/[locale]/layout.tsx` — add IBM Plex Mono font + viewport themeColor values
- `src/components/site/hero.tsx` — spec-sheet + calibrated falcon
- `src/components/site/site-header.tsx` — new nav (Automation/Security/Approach/About/Contact)
- `src/components/site/site-footer.tsx` — mono multi-column
- `src/components/site/contact-cta.tsx` — instrument close
- `src/app/[locale]/(site)/page.tsx` — Home rebuild
- `src/app/[locale]/(site)/about/page.tsx` — About rebuild
- `messages/en.json`, `messages/ar.json` — per-page namespaces, placeholders, localized tokens
- `src/app/sitemap.ts` — add routes

**Delete:**
- `src/types/next-auth.d.ts` — dead (no next-auth dep)
- `src/components/site/trust-strip.tsx`, `src/components/site/section-heading.tsx` — replaced by instrument kit (only after no page imports them)

---

## Task 1: Warm-mono ramp + IBM Plex Mono font

**Files:**
- Modify: `src/app/globals.css` (`:root`, `.dark`, `@theme`)
- Modify: `src/app/[locale]/layout.tsx` (font registration + viewport)

**Interfaces:**
- Produces: a `--font-mono` theme var (Tailwind `font-mono` utility) bound to IBM Plex Mono; warm neutral ramp on the same token names already used across the app (`--background`, `--foreground`, `--border`, etc.) so existing utilities keep working.

- [ ] **Step 1: Add IBM Plex Mono in the locale layout**

In `src/app/[locale]/layout.tsx`, alongside the existing font imports:

```tsx
import { Space_Grotesk, Inter, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
```

Add `${plexMono.variable}` to the `<html className>` template (next to the other `.variable`s).

- [ ] **Step 2: Register the mono var + keep warm themeColor**

In `globals.css` `@theme inline`, add under the font block:

```css
  --font-mono: var(--font-plex-mono);
```

In `layout.tsx` `viewport.themeColor`, update colors to the warm ramp:

```tsx
themeColor: [
  { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
  { media: "(prefers-color-scheme: dark)", color: "#110f0c" },
],
```

- [ ] **Step 3: Replace `:root` and `.dark` ramps (cold zinc → warm ink-on-paper)**

Replace the `:root` block values with:

```css
:root {
  color-scheme: light;
  --background: 40 24% 96%;
  --foreground: 45 18% 8%;
  --ink-2: 42 8% 38%;
  --surface: 40 22% 92%;
  --card: 40 24% 97%;
  --card-foreground: 45 18% 8%;
  --popover: 40 24% 97%;
  --popover-foreground: 45 18% 8%;
  --primary: 45 18% 8%;
  --primary-foreground: 40 24% 97%;
  --secondary: 40 18% 92%;
  --secondary-foreground: 45 18% 8%;
  --muted: 40 18% 92%;
  --muted-foreground: 42 7% 38%;
  --accent: 40 18% 92%;
  --accent-foreground: 45 18% 8%;
  --destructive: 0 65% 45%;
  --destructive-foreground: 40 24% 97%;
  --success: 142 60% 32%;
  --warning: 32 85% 38%;
  --border: 42 16% 82%;
  --input: 42 14% 76%;
  --ring: 45 18% 8%;
}
```

Replace the `.dark` block values with:

```css
.dark {
  color-scheme: dark;
  --background: 40 8% 6%;
  --foreground: 40 18% 95%;
  --ink-2: 40 10% 82%;
  --surface: 40 7% 10%;
  --card: 40 7% 10%;
  --card-foreground: 40 18% 95%;
  --popover: 40 7% 10%;
  --popover-foreground: 40 18% 95%;
  --primary: 40 18% 95%;
  --primary-foreground: 40 8% 6%;
  --secondary: 40 6% 15%;
  --secondary-foreground: 40 18% 95%;
  --muted: 40 6% 15%;
  --muted-foreground: 40 8% 64%;
  --accent: 40 6% 15%;
  --accent-foreground: 40 18% 95%;
  --destructive: 0 65% 52%;
  --destructive-foreground: 40 18% 95%;
  --success: 142 55% 45%;
  --warning: 38 90% 52%;
  --border: 40 6% 18%;
  --input: 40 7% 26%;
  --ring: 40 18% 95%;
}
```

- [ ] **Step 4: Verify** — `npx tsc --noEmit` clean; `pnpm dev` → Home renders on warm paper (not cold gray), light + dark both warm, no theme flash.
- [ ] **Step 5: Commit** — `git commit -m "feat(theme): warm ink-on-paper mono ramp + IBM Plex Mono"`

---

## Task 2: Instrument utilities + Arabic mono rule

**Files:** Modify `src/app/globals.css` (`@layer components` + the unlayered AR rule)

**Interfaces:**
- Produces CSS utility classes consumed by every kit component: `.ins-grid` (already `bg-grid`, keep), `.ins-crosshair`, `.ins-dim`, `.ins-rule`, `.ins-label` (mono tracked label), plus the AR rule extended to `.font-mono`.

- [ ] **Step 1: Extend the unlayered Arabic rule to mono**

Replace the existing `[lang="ar"] .font-display, .font-display [lang="ar"]` rule with:

```css
[lang="ar"] .font-display,
[lang="ar"] .font-mono,
.font-display [lang="ar"],
.font-mono [lang="ar"] {
  font-family: var(--font-plex-arabic), system-ui, sans-serif;
  letter-spacing: 0;
}
```

- [ ] **Step 2: Add instrument primitives in `@layer components`**

```css
@layer components {
  /* Tracked mono label used for section markers + annotations. */
  .ins-label {
    font-family: var(--font-mono), ui-monospace, monospace;
    font-size: 0.66rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: hsl(var(--muted-foreground));
  }
  /* Registration crosshair behind a calibrated mark. */
  .ins-crosshair { position: relative; }
  .ins-crosshair::before,
  .ins-crosshair::after {
    content: "";
    position: absolute;
    background: hsl(var(--border));
  }
  .ins-crosshair::before { left: 0; right: 0; top: 50%; height: 1px; }
  .ins-crosshair::after { top: 0; bottom: 0; left: 50%; width: 1px; }
  /* Dimension line with end ticks. */
  .ins-dim {
    position: relative;
    border-inline-end: 1px solid hsl(var(--ink-2));
  }
  .ins-dim::before,
  .ins-dim::after {
    content: "";
    position: absolute;
    inset-inline-end: -4px;
    width: 8px;
    height: 1px;
    background: hsl(var(--ink-2));
  }
  .ins-dim::before { top: 0; }
  .ins-dim::after { bottom: 0; }
}
```

(Keep the existing `bg-grid`, `rule`, `brand-card`, `brand-tick`.)

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; classes resolve in `pnpm dev` (no console warnings). AR page still uses Plex Arabic for any `.font-mono`.
- [ ] **Step 4: Commit** — `git commit -m "feat(theme): instrument css primitives + arabic mono rule"`

---

## Task 3: Site header + footer (instrument chrome)

**Files:** Modify `src/components/site/site-header.tsx`, `src/components/site/site-footer.tsx`

**Interfaces:**
- Consumes: catalog `nav.*` keys (Task 10) — but to keep this task self-contained, read existing `nav` keys now and extend in Task 10. Header nav links: `/services`, `/approach`, `/about`, `/contact` via `Link` from `@/i18n/navigation`.
- Produces: `<SiteHeader/>`, `<SiteFooter/>` used by `(site)/layout.tsx` (already wired).

- [ ] **Step 1:** Rework `site-header.tsx`: falcon `Logo` (icon+wordmark) on the start side; mono nav (`.ins-label`-styled `Link`s) for Automation→`/services#automation`, Security→`/services#security`, Approach→`/approach`, About→`/about`, Contact→`/contact`; keep `LocaleSwitcher` + `ThemeToggle`. Use `font-mono` for nav text. Hairline `border-b border-border`.
- [ ] **Step 2:** Rework `site-footer.tsx`: 3 mono columns (brand/tagline, NAVIGATE links, CONTACT: `contact@gyr.ae`, location placeholder, LinkedIn), copyright with `{year}`. All copy via `getTranslations("footer")`.
- [ ] **Step 3: Verify** — `npx tsc --noEmit`; `pnpm dev` header + footer render both locales, nav links resolve, AR mirrors (logo not mirrored).
- [ ] **Step 4: Commit** — `git commit -m "feat(site): instrument header + footer"`

---

## Task 4: SectionLabel + SpecHeader

**Files:** Create `src/components/site/instrument/section-label.tsx`, `src/components/site/instrument/spec-header.tsx`

**Interfaces:**
- Produces:
  - `SectionLabel({ index, children, className? })` → renders `§{index} — {children}` in `.ins-label`.
  - `SpecHeader({ meta, eyebrow, title, standfirst, action? })` where `meta: {label:string; value:string}[]`, `title: ReactNode`, `standfirst?: string`, `action?: ReactNode`. Layout: 3-col grid `[meta | headline+rule+standfirst | optional right slot]`; uses logical properties so it mirrors in RTL.

- [ ] **Step 1:** Write `section-label.tsx`:

```tsx
export function SectionLabel({
  index, children, className = "",
}: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`ins-label font-mono ${className}`}>
      <span aria-hidden>§{index} — </span>{children}
    </p>
  );
}
```

- [ ] **Step 2:** Write `spec-header.tsx` — metadata margin column (`.font-mono`, `meta.map`), oversized `font-display` title, hairline `.rule`, `font-sans` standfirst (`text-muted-foreground`), optional `action` slot, optional right `children` (for the calibrated falcon). Grid: `grid-cols-[6rem_1fr]` base, `lg:grid-cols-[6rem_1fr_13rem]` when a right slot is passed. Border between columns via `border-s`/logical.
- [ ] **Step 3: Verify** — `npx tsc --noEmit`. (Visually exercised in Task 6/pages.)
- [ ] **Step 4: Commit** — `git commit -m "feat(site): section-label + spec-header kit"`

---

## Task 5: CalibratedFalcon

**Files:** Create `src/components/site/instrument/calibrated-falcon.tsx`

**Interfaces:**
- Consumes: `FALCON_PATH` from `@/components/site/brand/falcon`.
- Produces: `CalibratedFalcon({ fig?, caption?, className? })` — a square-ish stage: `.ins-crosshair` background, centered falcon SVG (`currentColor`, not mirrored — wrap in `dir="ltr"`), `.ins-dim` on the end side, mono corner annotations `+ {fig}` and `{caption}`.

- [ ] **Step 1:** Implement with the real path:

```tsx
import { FALCON_PATH } from "@/components/site/brand/falcon";

export function CalibratedFalcon({
  fig = "FIG.01", caption = "FALCON / STOOP", className = "",
}: { fig?: string; caption?: string; className?: string }) {
  return (
    <div className={`relative ins-crosshair border-s border-border ${className}`}>
      <div dir="ltr" className="absolute inset-0 grid place-items-center">
        <svg viewBox="22 31 97 124" fill="currentColor" aria-hidden
             className="h-[60%] w-auto text-foreground">
          <path d={FALCON_PATH} />
        </svg>
      </div>
      <span className="ins-dim absolute inset-y-6 end-3" aria-hidden />
      <span className="ins-label absolute start-1.5 top-1.5">+ {fig}</span>
      <span className="ins-label absolute start-1.5 bottom-1.5">{caption}</span>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit`. Mark mirroring: confirm `dir="ltr"` wrapper keeps the falcon un-flipped in RTL (checked in Task 11).
- [ ] **Step 3: Commit** — `git commit -m "feat(site): calibrated-falcon stage"`

---

## Task 6: Hero (spec-sheet + calibrated falcon)

**Files:** Modify `src/components/site/hero.tsx`

**Interfaces:**
- Consumes: `SpecHeader`, `CalibratedFalcon`.
- Produces: `Hero({ meta, eyebrow, title, standfirst, actions, variant? })` — keeps the `variant="lite"` prop the About page uses; `variant="lite"` omits the calibrated falcon + metadata for inner-page headers.

- [ ] **Step 1:** Rebuild `hero.tsx` to render `SpecHeader` with `meta` margin + `title` (supports `t.rich` accent) + `standfirst` + `actions`, and pass `<CalibratedFalcon/>` as the right slot when `variant !== "lite"`. Preserve the `fade-up` entrance animation.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`; `pnpm dev` Home hero matches the `home-structure.html` mockup (metadata margin, big headline, falcon stage).
- [ ] **Step 3: Commit** — `git commit -m "feat(site): spec-sheet hero with calibrated falcon"`

---

## Task 7: IndexTable + CapabilityBlock

**Files:** Create `src/components/site/instrument/index-table.tsx`, `src/components/site/instrument/capability-block.tsx`

**Interfaces:**
- Produces:
  - `IndexTable({ rows })` where `rows: { num:string; name:string; desc:string; tag:string }[]` → hairline-separated grid rows `[num | name | desc | tag]`, mono num/tag.
  - `CapabilityBlock({ num, title, body, items })` where `items: string[]` → heading + body + mono `→ item` sub-list with hairline separators.

- [ ] **Step 1:** Implement `index-table.tsx` (grid `grid-cols-[3rem_1fr] md:grid-cols-[3rem_1.2fr_1.6fr_5rem]`, `border-t border-border` per row, mono num/tag, `font-sans` desc).
- [ ] **Step 2:** Implement `capability-block.tsx` (mono `num`, `font-display` title, `text-muted-foreground` body, `<ul>` of `font-mono` items with `border-t` separators).
- [ ] **Step 3: Verify** — `npx tsc --noEmit`.
- [ ] **Step 4: Commit** — `git commit -m "feat(site): index-table + capability-block"`

---

## Task 8: ProcessSequence

**Files:** Create `src/components/site/instrument/process-sequence.tsx`

**Interfaces:**
- Produces: `ProcessSequence({ steps, orientation? })` where `steps: { sn:string; title:string; desc:string }[]`, `orientation: "row" | "column"` (default `"row"`). Row = horizontal nodes with connector rail (for Home §03); column = vertical expanded (for /approach §01). Node = `dot` + connector + mono `STEP {sn}` + `font-display` title + desc.

- [ ] **Step 1:** Implement both orientations; connector rail via a positioned `border-t`/`border-s` that hides on the last step.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`.
- [ ] **Step 3: Commit** — `git commit -m "feat(site): process-sequence"`

---

## Task 9: Founder blocks + Contact panel

**Files:** Create `src/components/site/founder-note.tsx`, `src/components/site/founder-profile.tsx`, `src/components/site/contact-panel.tsx`; modify `src/components/site/contact-cta.tsx`

**Interfaces:**
- Produces:
  - `FounderNote({ quote, name, role, linkedin, draft? })` — portrait slot (hatched placeholder until a real `/public` photo exists), quote, signature, mono `name · role`, LinkedIn link. `draft` renders the amber `DRAFT — NEEDS APPROVAL` flag.
  - `FounderProfile({ ... })` — expanded About variant (large portrait, full bio paragraphs `bio: string[]`, role, LinkedIn).
  - `ContactPanel({ email, subject, guidance, details })` — mailto button (`href={mailto:${email}?subject=${encodeURIComponent(subject)}}`), guidance list, mono details block.
- All copy passed in from pages (which read the catalog); components hold no hardcoded strings except structural punctuation.

- [ ] **Step 1:** Implement the three components + rework `contact-cta.tsx` into the instrument close (headline + `EMAIL GYR` mailto button + mono `> contact@gyr.ae`).
- [ ] **Step 2:** Portrait placeholder: a bordered box with the hatched CSS background + `[ PORTRAIT ]` mono label and the `draft` flag, matching `home-structure.html`.
- [ ] **Step 3: Verify** — `npx tsc --noEmit`. Confirm mailto string encodes the subject.
- [ ] **Step 4: Commit** — `git commit -m "feat(site): founder note/profile + mailto contact panel"`

---

## Task 10: Message catalog restructure (en + ar)

**Files:** Modify `messages/en.json`, `messages/ar.json`

**Interfaces:**
- Produces all keys consumed by Tasks 3, 11–15. Namespaces: `nav`, `switcher`, `theme`, `footer`, `seo`, `home`, `services`, `approach`, `about`, `contact`. Every value is placeholder/framing copy (no factual claims); factual slots carry a literal `[TBD]` marker in the string so they're visible in dev.

- [ ] **Step 1:** Author `en.json` with the full key set per the page tasks below. Capability sub-lists, sector list, founder bio/quote, and location values contain `[TBD]` and are framing-only.
- [ ] **Step 2:** Author `ar.json` with the SAME keys (parity). Instrument tokens (`DOC/REV/CLASS`, `§` section names, `FIG.01`, `STEP`) get Arabic equivalents; numerals stay Western (per spec §8, flagged). No Latin mono text in AR strings.
- [ ] **Step 3: Verify** — `npx tsc --noEmit`; write a throwaway check that both files `JSON.parse` and have identical key sets:

Run: `node -e "const a=require('./messages/en.json'),b=require('./messages/ar.json');const k=o=>Object.entries(o).flatMap(([x,v])=>typeof v==='object'?k(v).map(s=>x+'.'+s):[x]);const ka=k(a).sort(),kb=k(b).sort();console.log(JSON.stringify(ka)===JSON.stringify(kb)?'PARITY OK':'MISMATCH:'+ka.filter(x=>!kb.includes(x))+' / '+kb.filter(x=>!ka.includes(x)))"`
Expected: `PARITY OK`

- [ ] **Step 4: Commit** — `git commit -m "feat(i18n): per-page catalog namespaces (placeholder content)"`

---

## Task 11: Home page

**Files:** Modify `src/app/[locale]/(site)/page.tsx`

**Interfaces:** Consumes Hero, SectionLabel, CapabilityBlock, IndexTable, ProcessSequence, FounderNote, ContactCta; `home` + `seo` namespaces; `organizationJsonLd`/`websiteJsonLd`.

- [ ] **Step 1:** Compose the section sequence from `home-structure.html`: Hero (meta + calibrated falcon) → §01 two `CapabilityBlock`s → §02 `IndexTable` (5 build lanes) → §03 `ProcessSequence` row + "see the full method →" `Link` to `/approach` → §04 `FounderNote` (draft) → §05 sectors mono row (`[TBD]`-flagged) → §06 `ContactCta`. Keep `generateMetadata`, `setRequestLocale`, JSON-LD.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`; `pnpm build` (Home prerenders both locales); `pnpm dev` matches mockup EN + AR; AR mirrors layout, falcon un-mirrored, no script-mixing.
- [ ] **Step 3: Commit** — `git commit -m "feat(home): instrument home page"`

---

## Task 12: Services page

**Files:** Create `src/app/[locale]/(site)/services/page.tsx`

**Interfaces:** Consumes Hero (`variant="lite"` SpecHeader), SectionLabel, CapabilityBlock, IndexTable, ContactCta; `services` + `seo` namespaces; `breadcrumbJsonLd`. Anchors `#automation` / `#security` for header nav.

- [ ] **Step 1:** Header → §01 AI Automation (`CapabilityBlock` expanded, `id="automation"`) → §02 Cybersecurity (`id="security"`) → §03 detailed `IndexTable` → §04 ContactCta. `generateMetadata` (`path:"/services"`), `setRequestLocale`, breadcrumb JSON-LD.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`; `pnpm build` prerenders `/services` both locales; anchors scroll.
- [ ] **Step 3: Commit** — `git commit -m "feat(services): capabilities page"`

---

## Task 13: Approach page

**Files:** Create `src/app/[locale]/(site)/approach/page.tsx`

**Interfaces:** Consumes Hero(lite), SectionLabel, ProcessSequence(column), ContactCta; `approach` + `seo`; `breadcrumbJsonLd`.

- [ ] **Step 1:** Header → §01 `ProcessSequence` column (4 expanded steps) → §02 governance/posture text block → §03 principles (3 `brand-card`s or mono list) → §04 ContactCta. Metadata, setRequestLocale, breadcrumb.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`; `pnpm build` prerenders `/approach` both locales.
- [ ] **Step 3: Commit** — `git commit -m "feat(approach): method page"`

---

## Task 14: About page

**Files:** Modify `src/app/[locale]/(site)/about/page.tsx`

**Interfaces:** Consumes Hero(lite), SectionLabel, FounderProfile, ContactCta; `about` + `seo`; `breadcrumbJsonLd`.

- [ ] **Step 1:** Header → §01 company statement paragraphs → §02 `FounderProfile` (draft) → §03 values row → §04 ContactCta. Keep existing breadcrumb pattern.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`; `pnpm build` prerenders `/about` both locales.
- [ ] **Step 3: Commit** — `git commit -m "feat(about): instrument about + founder profile"`

---

## Task 15: Contact page

**Files:** Create `src/app/[locale]/(site)/contact/page.tsx`

**Interfaces:** Consumes Hero(lite), SectionLabel, ContactPanel; `contact` + `seo`; `breadcrumbJsonLd`.

- [ ] **Step 1:** Header → §01 `ContactPanel` (mailto + founder line) → §02 what-to-include guidance → §03 details. Metadata, setRequestLocale, breadcrumb. No form, no server.
- [ ] **Step 2: Verify** — `npx tsc --noEmit`; `pnpm build` prerenders `/contact` both locales; mailto opens composer with subject.
- [ ] **Step 3: Commit** — `git commit -m "feat(contact): mailto contact page"`

---

## Task 16: Sitemap, cleanup, final verification

**Files:** Modify `src/app/sitemap.ts`; delete `src/types/next-auth.d.ts`, `src/components/site/trust-strip.tsx`, `src/components/site/section-heading.tsx` (only if unreferenced).

- [ ] **Step 1:** Add `/services`, `/approach`, `/contact` to `sitemap.ts` for both locales (follow existing pattern; include `/`, `/about`).
- [ ] **Step 2:** `git grep -n "trust-strip\|section-heading\|next-auth"` → if no `src/` references remain, delete the three dead files.
- [ ] **Step 3: Full verification gate:**
  - `npx tsc --noEmit` → clean
  - `pnpm lint` → clean
  - `pnpm build` → 5 routes × 2 locales = 10 site routes prerender statically (plus sitemap/robots/manifest); no dynamic-server errors
  - `pnpm dev` manual checklist: EN + AR render with correct fonts and no script-mixing; light/dark inversion clean, no flash; RTL mirrors layout but not the falcon; all nav links + anchors work; mailto opens with subject; reduced-motion respected; every `[TBD]`/draft flag visible where expected.
- [ ] **Step 4: Commit** — `git commit -m "chore(site): sitemap routes + remove dead CMS-era files"`

---

## Self-Review

**Spec coverage:** §3 positioning → Tasks 10–15 copy/structure. §4.1 ramp → Task 1. §4.2 type/mono → Tasks 1–2. §4.3 kit → Tasks 4–9. §4.4 motion → preserved in Tasks 1/6. §4.5 hero → Task 6. §5 IA → Tasks 11–15. §6 codebase map → matches file structure. §7 SEO → Tasks 12–16. §8 i18n/RTL → Tasks 2, 5, 10, 11. §9 governance → Task 10 placeholders + Global Constraints. §10 verification → Task 16. No gaps.

**Placeholder scan:** `[TBD]` appears only as intentional in-content flags (Task 10), never as plan-step evasions. Component code steps show real signatures/code; page tasks reference exact components and namespaces.

**Type consistency:** Component prop names are defined once in their creating task's Interfaces block and consumed by the same names in page tasks (`CapabilityBlock({num,title,body,items})`, `IndexTable({rows:{num,name,desc,tag}})`, `ProcessSequence({steps:{sn,title,desc},orientation})`, `FounderNote({quote,name,role,linkedin,draft})`, `ContactPanel({email,subject,guidance,details})`). `Hero` keeps its existing `variant` prop. Consistent.
