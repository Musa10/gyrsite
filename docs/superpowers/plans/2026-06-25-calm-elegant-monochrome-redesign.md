# Calm/Elegant Monochrome Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace GYR's rejected "technical-instrument / warm-monochrome" visual language with a calm, elegant, neutral black↔white system that ships first-class light *and* dark themes, across all five bilingual pages.

**Architecture:** Pure restyle of the existing static next-intl site. Reuse the working theme machinery (`ThemeProvider` + pre-paint init script + `ThemeToggle`) and only swap token *values* and typography. Retire the instrument component kit and rebuild calm, type-led, whitespace-driven equivalents. No new dependencies, no backend.

**Tech Stack:** Next.js 16 (App Router, React 19), next-intl, Tailwind v4 (`@theme` in `globals.css`), `next/font/google` (Inter + IBM Plex Sans Arabic only), lucide-react (existing).

**Spec:** `docs/superpowers/specs/2026-06-25-calm-elegant-monochrome-redesign-design.md`

> **Execution note (user-agreed method):** Fine visual values — exact spacing, type sizes, line-heights — are tuned **live** against the running site in both themes after each task, not pre-frozen here. This plan fixes structure, decisions, tokens, and component contracts; pixel-polish happens in `pnpm dev` review. This is a deliberate override of the "pixel-complete markup" rule for a visual redesign.

## Global Constraints

- **Package manager: pnpm only.** Never `npm install`. Use `pnpm add` / `pnpm install`.
- **No test harness.** Per-task verification gate = `npx tsc --noEmit` (primary) → `pnpm lint` → `pnpm build` (all 10 routes must prerender static) → manual `pnpm dev` check in **both locales (en, ar) AND both themes (light, dark)**. Each task ends by passing this gate, then commits.
- **Monochrome, neutral only.** Faint-cool neutral ramp (HSL hue 240, very low saturation — a zinc-like grey). **No accent hue anywhere.**
- **Banned effects ("no light bulbs"):** glows, drop-shadow halos, radial spotlights, chrome/metallic fills, animated grids/radar/scan/shimmer, heavy gradients, decorative dashed "content-pass" pills, generic 3-card feature grids. Allowed motion: a single subtle `fade-up` on first view + smooth theme transition; everything `prefers-reduced-motion`-gated.
- **Type:** Inter for all Latin (display = Inter at light weight + tight tracking; labels = uppercase wide-tracked Inter — **not** monospace). IBM Plex Sans Arabic for the `ar` locale. Remove Space Grotesk + IBM Plex Mono.
- **Falcon:** `FalconMark`/`FALCON_PATH` in `brand/` unchanged; matte `currentColor`; never recolored/glowing/animated; wrap `dir="ltr"` inside RTL so it is never mirrored.
- **i18n:** copy lives in `messages/{en,ar}.json`, EN/AR key parity enforced; never hardcode visible strings in JSX; use the locale-aware `Link` from `@/i18n/navigation`; every page/layout calls `setRequestLocale(locale)`.
- **Content governance:** no invented facts (clients, logos, certs, metrics, bios); pending real assets get an *intentional* neutral treatment, never a fake; `contact@gyr.ae` is the only contact channel; **do not deploy until the content pass is approved**; `NEXT_PUBLIC_SITE_URL` must be set at deploy.

---

### Task 1: Neutral dual-theme palette + Inter-only typography

**Files:**
- Modify: `src/app/globals.css` (`@theme` font vars, `:root`, `.dark`)
- Modify: `src/app/[locale]/layout.tsx` (font registration, `themeColor`, `<html>` className)

**Interfaces:**
- Produces: the neutral token set consumed by every Tailwind color utility (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.) and the `font-sans`/`font-display`/`font-arabic` utilities used by all later tasks.

- [ ] **Step 1: Swap `@theme` font vars** in `globals.css` — point display at Inter, drop mono:

```css
  --font-sans: var(--font-inter);
  --font-display: var(--font-inter);
  --font-arabic: var(--font-plex-arabic);
  /* (remove the --font-mono line entirely) */
```

- [ ] **Step 2: Replace the `:root` (light) ramp** with the neutral zinc-like values:

```css
:root {
  color-scheme: light;
  --background: 240 6% 99%;
  --foreground: 240 6% 10%;
  --ink-2: 240 4% 40%;
  --surface: 240 6% 96%;
  --card: 240 6% 99%;
  --card-foreground: 240 6% 10%;
  --popover: 240 6% 99%;
  --popover-foreground: 240 6% 10%;
  --primary: 240 6% 10%;
  --primary-foreground: 240 6% 99%;
  --secondary: 240 5% 96%;
  --secondary-foreground: 240 6% 10%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 40%;
  --accent: 240 5% 96%;
  --accent-foreground: 240 6% 10%;
  --destructive: 0 0% 25%;
  --destructive-foreground: 0 0% 98%;
  --success: 0 0% 35%;
  --warning: 0 0% 45%;
  --border: 240 6% 90%;
  --input: 240 6% 86%;
  --ring: 240 6% 10%;
}
```

- [ ] **Step 3: Replace the `.dark` ramp** with the neutral inversion:

```css
.dark {
  color-scheme: dark;
  --background: 240 6% 5%;
  --foreground: 240 6% 96%;
  --ink-2: 240 5% 65%;
  --surface: 240 5% 9%;
  --card: 240 5% 9%;
  --card-foreground: 240 6% 96%;
  --popover: 240 5% 9%;
  --popover-foreground: 240 6% 96%;
  --primary: 240 6% 96%;
  --primary-foreground: 240 6% 5%;
  --secondary: 240 4% 14%;
  --secondary-foreground: 240 6% 96%;
  --muted: 240 4% 14%;
  --muted-foreground: 240 5% 64%;
  --accent: 240 4% 14%;
  --accent-foreground: 240 6% 96%;
  --destructive: 0 0% 75%;
  --destructive-foreground: 0 0% 9%;
  --success: 0 0% 70%;
  --warning: 0 0% 65%;
  --border: 240 4% 16%;
  --input: 240 4% 24%;
  --ring: 240 6% 96%;
}
```

- [ ] **Step 4: Update `layout.tsx` fonts** — remove `Space_Grotesk` and `IBM_Plex_Mono` imports + their `const` instances; keep `Inter` and `IBM_Plex_Sans_Arabic`. Update the `<html>` className to `` `${inter.variable} ${plexArabic.variable} h-full antialiased` ``. Update `themeColor` to neutral:

```ts
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
  ],
};
```

- [ ] **Step 5: Gate.** Run `npx tsc --noEmit` (expect clean), `pnpm lint`, `pnpm build` (expect 10 static routes). Then `pnpm dev` and confirm: site is neutral grey (no warm cast), text is Inter, theme toggle flips light↔dark with no flash. (Components still use old structure — that's expected; this task only swaps palette + type.)
- [ ] **Step 6: Commit** — `git commit -am "feat(theme): neutral monochrome dual-theme ramp + Inter-only type"`

---

### Task 2: Calm CSS utilities + simplified Arabic rule (retire instrument primitives)

**Files:**
- Modify: `src/app/globals.css` (`@layer components`, Arabic rule)

**Interfaces:**
- Produces: `.eyebrow` (the canonical label class, replaces `.ins-label`), `.rule` (kept), `.placeholder-frame` (intentional pending-asset treatment), `.lift` (calm hover). Consumed by all component/page tasks.

- [ ] **Step 1: Replace the `@layer components` block.** Remove `.bg-grid`, `.brand-card` (colored-glow hover), `.brand-tick`, and the entire `/* Technical-instrument kit */` group (`.ins-label`, `.ins-crosshair`, `.ins-dim`, `.ins-hatch`). Add calm utilities:

```css
@layer components {
  /* Hairline rule that fades at both ends. */
  .rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, hsl(var(--border)), transparent);
  }
  /* Canonical small label — uppercase, wide tracking, Inter (not mono). */
  .eyebrow {
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: hsl(var(--muted-foreground));
  }
  /* Calm hover — a 1px border warm-up, no transform jump, no glow. */
  .lift { transition: border-color 0.2s ease, color 0.2s ease; }
  /* Intentional treatment for a pending real asset (e.g. founder photo).
     Reads as a designed frame, never an apologetic placeholder. */
  .placeholder-frame {
    background: hsl(var(--surface));
    border: 1px solid hsl(var(--border));
  }
}
```

- [ ] **Step 2: Simplify the Arabic rule** to target the new label/display classes (drop `.font-mono`/`.ins-label`):

```css
[lang="ar"] .font-display,
[lang="ar"] .eyebrow,
.font-display [lang="ar"] {
  font-family: var(--font-plex-arabic), system-ui, sans-serif;
  letter-spacing: 0;
}
```

- [ ] **Step 3: Gate.** `npx tsc --noEmit`; `pnpm lint`; `pnpm build`. Build will still pass even though components reference now-removed classes (they'll just lose styling) — that's fixed in Tasks 3–10. Confirm no CSS syntax errors.
- [ ] **Step 4: Commit** — `git commit -am "feat(theme): calm utility layer; retire instrument CSS primitives"`

---

### Task 3: Calm shared component kit

**Files:**
- Create: `src/components/site/kit/section.tsx`, `eyebrow.tsx`, `section-heading.tsx`, `capability-row.tsx`, `statement.tsx`, `process-sequence.tsx`, `placeholder-frame.tsx`
- (These replace `src/components/site/instrument/*`, deleted in Task 11.)

**Interfaces:**
- Produces (exact contracts later tasks rely on):
  - `Section({ children, className }): JSX` — centered `max-w-5xl` wrapper with generous vertical padding.
  - `Eyebrow({ children }): JSX` — renders `<p className="eyebrow font-display">`.
  - `SectionHeading({ eyebrow?, title, sub?, align? }): JSX` — eyebrow + large light-weight `font-display` title + optional muted sub.
  - `CapabilityRow({ index, title, body, items? }): JSX` — editorial row: hairline top, small index, title, body, optional plain item list. **No card border/grid.**
  - `Statement({ children }): JSX` — oversized calm pull-statement (one emphasized word via `font-semibold`, never color).
  - `ProcessSequence({ steps }: { steps: {n,title,body}[] }): JSX` — quiet numbered list separated by `.rule`.
  - `PlaceholderFrame({ label, ratio? }): JSX` — `.placeholder-frame` with a centered low-opacity matte `FalconMark` + small muted `label`; an intentional pending-asset frame.

- [ ] **Step 1: Build the seven components** to the contracts above. Rules: type via `font-display`/`font-sans`; labels via `<Eyebrow>`; separation via whitespace + `.rule`; matte `FalconMark` only; `prefers-reduced-motion`-safe `animate-fade-up` allowed on section reveal; **no** borders-as-cards, glows, or color. Each is a server component unless it needs interactivity (none do).
- [ ] **Step 2: Gate.** `npx tsc --noEmit`; `pnpm lint`; `pnpm build`. (Components compile but aren't wired into pages yet.)
- [ ] **Step 3: Commit** — `git commit -am "feat(site): calm shared component kit"`

---

### Task 4: Hero (calm centerpiece + lite variant)

**Files:**
- Rewrite: `src/components/site/hero.tsx`

**Interfaces:**
- Consumes: `FalconMark` (`brand/falcon`), `Eyebrow` (kit).
- Produces: `Hero({ eyebrow, title, sub?, actions?, variant?, showMark? })` — `variant="full"` (Home): centered, matte `FalconMark` (~`h-16`), `<Eyebrow>`, large light-weight `font-display` headline (tracking `-0.02em`, emphasized word via `font-semibold`), calm sub, actions row. `variant="lite"` (interior pages): same minus the mark, smaller headline, left-aligned. No grid, no glow, no `SpecHeader`/`CalibratedFalcon`.

- [ ] **Step 1: Rewrite `hero.tsx`** to the contract. Drop all imports of `spec-header`/`calibrated-falcon`. Falcon wrapped in `<span dir="ltr">` so it never mirrors in RTL.
- [ ] **Step 2: Gate.** `npx tsc --noEmit`; `pnpm lint`; `pnpm build`. (Home still imports old hero props — reconcile in Task 6; if build breaks on prop mismatch, it is fixed there. To keep this task green, temporarily ensure `hero.tsx` exports are type-compatible or update the single Home call site minimally.)
- [ ] **Step 3: Commit** — `git commit -am "feat(site): calm centerpiece hero"`

---

### Task 5: Header, footer, theme toggle, nav copy

**Files:**
- Rewrite: `src/components/site/site-header.tsx`, `src/components/site/site-footer.tsx`
- Modify: `src/components/site/theme-toggle.tsx`, `src/components/site/locale-switcher.tsx` (style match only)
- Modify: `messages/en.json`, `messages/ar.json` (`nav` namespace)

**Interfaces:**
- Consumes: `Logo` (`brand/logo`), `ThemeToggle`, `LocaleSwitcher`, `Link` (`@/i18n/navigation`).

- [ ] **Step 1: Header** — minimal calm bar: `Logo` left; quiet text links right in `font-sans` (sentence case, `text-sm`, `text-muted-foreground`, hover→`text-foreground`, no mono, no underline-grow gimmick beyond a subtle opacity/color shift); `ThemeToggle` + `LocaleSwitcher`. Links = **Services · Approach · About · Contact** (drop the `#automation`/`#security` split). Hairline `border-b`. Keep `sticky` + light `backdrop-blur`.
- [ ] **Step 2: Nav copy** — add a `nav.services` key (en: "Services", ar: "الخدمات") to both catalogs; remove now-unused `nav.automation`/`nav.security` only if no other consumer (grep first). Keep EN/AR parity.
- [ ] **Step 3: Footer** — minimal columns: falcon wordmark + one-line descriptor; Company / Contact / Legal columns with `<Eyebrow>` headings and `font-sans` links; hairline top. Monochrome only.
- [ ] **Step 4: Toggle/switcher** — confirm both match the calm border style (`border-border`, hover `border-foreground/40`); adjust only if visually off. Functionality unchanged.
- [ ] **Step 5: Gate** (both themes + both locales; verify RTL header mirrors correctly, falcon does not). `npx tsc --noEmit`; `pnpm lint`; `pnpm build`.
- [ ] **Step 6: Commit** — `git commit -am "feat(site): calm header, footer, nav copy"`

---

### Task 6: Home page

**Files:**
- Rewrite: `src/app/[locale]/(site)/page.tsx`
- Modify: `messages/{en,ar}.json` (`home` namespace — adjust labels/eyebrows to calm copy; keep keys/parity; no new factual claims)

**Interfaces:**
- Consumes: `Hero` (full), `Section`, `SectionHeading`, `CapabilityRow`, `Statement`, `ProcessSequence`, `FounderNote` (Task 9), `ContactCta` (Task 10).

- [ ] **Step 1: Compose Home** — `Hero(full)` → capabilities as 3 `CapabilityRow`s (AI Automation / Cybersecurity / Secure Integration), hairline-separated, **not** a card grid → a `Statement` ("why GYR") → calm `ProcessSequence` (Map/Build/Harden/Hand over) → `FounderNote` (Sultan, matte) → `ContactCta`. Keep `setRequestLocale`, pull copy from `home` namespace.
- [ ] **Step 2: Reconcile** any copy keys; ensure EN/AR parity (`node` parity check or manual diff of key sets).
- [ ] **Step 3: Gate** (both themes + locales; calm, no banned effects). `npx tsc --noEmit`; `pnpm lint`; `pnpm build`.
- [ ] **Step 4: Commit** — `git commit -am "feat(site): rebuild Home in calm language"`

---

### Task 7: Services page

**Files:**
- Rewrite: `src/app/[locale]/(site)/services/page.tsx`
- Modify: `messages/{en,ar}.json` (`services` namespace)

- [ ] **Step 1: Compose** — `Hero(lite)` → `Section`s for each discipline (AI Automation, Cybersecurity, Secure Integration) using `SectionHeading` + `CapabilityRow`/prose; honest non-factual framing copy only; `ContactCta`. Keep `setRequestLocale`.
- [ ] **Step 2: Gate** (both themes + locales). `npx tsc --noEmit`; `pnpm lint`; `pnpm build`.
- [ ] **Step 3: Commit** — `git commit -am "feat(site): rebuild Services in calm language"`

---

### Task 8: Approach page

**Files:**
- Rewrite: `src/app/[locale]/(site)/approach/page.tsx`
- Modify: `messages/{en,ar}.json` (`approach` namespace)

- [ ] **Step 1: Compose** — `Hero(lite)` → `Statement` of the working philosophy → `ProcessSequence` (the accountable path) → `ContactCta`. `setRequestLocale`.
- [ ] **Step 2: Gate** (both themes + locales). `npx tsc --noEmit`; `pnpm lint`; `pnpm build`.
- [ ] **Step 3: Commit** — `git commit -am "feat(site): rebuild Approach in calm language"`

---

### Task 9: About page + founder components

**Files:**
- Rewrite: `src/app/[locale]/(site)/about/page.tsx`, `src/components/site/founder-note.tsx`, `src/components/site/founder-profile.tsx`
- Modify: `messages/{en,ar}.json` (`about` namespace)

**Interfaces:**
- Produces: `FounderNote({ ...about-namespace copy })` — compact signed note for Home; `FounderProfile(...)` — full About block: `PlaceholderFrame` portrait (label "Sultan Alowais"), display-weight pull-quote, name, role, LinkedIn link (`/in/sultanalowais/`).

- [ ] **Step 1: Rebuild** `founder-note` + `founder-profile` calm (matte falcon, `PlaceholderFrame` for the pending photo — intentional, not dashed). Founder copy stays canonical in the `about` namespace; no invented bio facts beyond the user-confirmed name + LinkedIn.
- [ ] **Step 2: Compose About** — `Hero(lite)` → company framing → `FounderProfile` → `ContactCta`. `setRequestLocale`.
- [ ] **Step 3: Gate** (both themes + locales; founder photo frame reads as intentional). `npx tsc --noEmit`; `pnpm lint`; `pnpm build`.
- [ ] **Step 4: Commit** — `git commit -am "feat(site): rebuild About + founder blocks in calm language"`

---

### Task 10: Contact page + CTA

**Files:**
- Rewrite: `src/app/[locale]/(site)/contact/page.tsx`, `src/components/site/contact-cta.tsx`, `src/components/site/contact-panel.tsx`
- Modify: `messages/{en,ar}.json` (`contact` namespace)

- [ ] **Step 1: Rebuild** `contact-cta` (calm closing band: statement + `mailto:contact@gyr.ae` action) and `contact-panel`; rebuild the Contact page using them. Mailto only — no form, no backend. `setRequestLocale`.
- [ ] **Step 2: Gate** (both themes + locales; mailto resolves to `contact@gyr.ae`). `npx tsc --noEmit`; `pnpm lint`; `pnpm build`.
- [ ] **Step 3: Commit** — `git commit -am "feat(site): rebuild Contact + CTA in calm language"`

---

### Task 11: Delete dead instrument kit + draft-flag; final QA

**Files:**
- Delete: `src/components/site/instrument/` (section-label, spec-header, calibrated-falcon, index-table, capability-block, process-sequence), `src/components/site/draft-flag.tsx`, and `src/components/site/page-header.tsx` **iff** no longer referenced.
- Verify: `src/app/sitemap.ts` already lists `/services /approach /contact` (no change expected).

- [ ] **Step 1: Grep** for every deletion target (`grep -rn "instrument/\|draft-flag\|page-header\|SpecHeader\|CalibratedFalcon\|ins-label\|font-mono\|space-grotesk\|plex-mono"` across `src`). Confirm zero live references, then delete the files and remove any stragglers.
- [ ] **Step 2: Full gate** — `npx tsc --noEmit` (clean), `pnpm lint` (clean), `pnpm build` (10 static routes). Then a complete `pnpm dev` walkthrough: all 5 pages × {en, ar} × {light, dark} = confirm calm/elegant feel, no banned effects, correct RTL, falcon never mirrored, theme toggle persists, reduced-motion honored.
- [ ] **Step 3: Commit** — `git commit -am "chore(site): remove dead instrument kit + draft-flag after calm redesign"`

---

## Self-Review

**Spec coverage:** §2 principles → enforced via Global Constraints + Tasks 1–4. §3 banned/allowed → Global Constraints + Task 2/11 grep. §4.1 color/theme → Task 1. §4.2 type → Tasks 1–2. §4.3 falcon → Tasks 3,4,9 (matte, `dir=ltr`). §4.4–4.5 layout/motion → Tasks 2,3. §4.6 components → Tasks 3,4,5,9,10. §5 IA (5 pages) → Tasks 6–10. §6 theme system → reused machinery, retuned in Task 1, QA'd in Task 11. §8 content governance → Global Constraints + Tasks 6–10 (no invented facts) + 9 (intentional placeholder). §9 verification → every task gate + Task 11. ✅ No gaps.

**Placeholder scan:** No "TBD/handle-edge-cases" steps; concrete token values and component contracts given. Page tasks intentionally defer pixel-polish to live review per the stated user-agreed method (not a placeholder — an explicit method choice). ✅

**Type consistency:** Component names/props are defined once in Task 3/4/9 interface blocks and referenced consistently (`Hero` variant `full|lite`; `CapabilityRow{index,title,body,items?}`; `ProcessSequence{steps}`; `PlaceholderFrame{label,ratio?}`). ✅
