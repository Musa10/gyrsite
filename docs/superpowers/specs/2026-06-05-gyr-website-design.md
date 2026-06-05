# GYR Website Design — Direction A (Bank-Grade Institutional)

**Date:** 2026-06-05
**Status:** Approved design, ready for implementation planning
**Scope:** Visual redesign of the public GYR site (Home, About, Insights) plus a reusable brand component system that keeps CMS-rendered content on-brand.

---

## 1. Context & Goals

GYR is a technology company that builds **AI-driven software products**. Its primary customers are **banks / financial institutions**, with meaningful room for other enterprise customers.

**Primary job of the website:** establish **credibility & prestige** — make GYR feel established, serious, and trustworthy at a glance to investors, enterprise partners, and especially bank procurement/technology buyers.

**Design direction:** "Quiet Institutional" (Direction A) — sovereign-fund calm, generous whitespace, thin/light type, restrained motion. The register a bank's technology committee trusts. Explicitly **not** startup-neon or gamer-tech.

**Hard constraint:** **No geographic / UAE positioning** anywhere. Remove "UAE Proud", "Dubai to the world", and the UAE-geometric / Burj-skyline motifs. The falcon, circuit traces, teal palette, and the جير wordmark stay — they are brand, not geography.

### Non-goals (YAGNI)
- No Team/Leadership page (dropped from scope; existing `/team` route may be removed or left dormant — decided in planning).
- No Capabilities or Careers pages.
- No full standalone Contact page (handled as a section + footer form — see §5).
- No e-commerce, auth changes, or CMS schema migration beyond what §6 specifies (which is: none required).

---

## 2. Brand Assets

Source lockups now live in `/public` with clean names (renamed by the user from the original `ChatGPT Image …png` files):

- `logoHorizentaldark.png` / `logoHorizentallight.png` — horizontal lockup (emblem + GYR + جير)
- `logowithnamedark.png` / `logowithnamelight.png` — vertical lockup (emblem above جير/GYR)
- `loglight.png` — light wordmark/emblem
- `backgrounddark.png` / `backgroundlight.png` — full hero background plates
- `circuitsdark.png` / `circuitslight.png` — circuit-trace texture plates

**Production asset work (implementation step):**
1. **Chroma-key the falcon emblem to transparent** so it floats on the exact page background with no visible box/plate seam. Use the existing `sharp` dependency (luminance key), consistent with how the prior brand set was processed.
2. Derive `favicon-32/48.png`, `apple-touch-icon.png`, `icon-512.png`, and an OG/`banner` image from the lockups.
3. The old `public/brand/*` set was deleted; do not reference it. The deleted root placeholder images (`file.svg`, etc.) stay deleted.

---

## 3. Visual System

Refinement of the existing `src/app/globals.css` token system — **tune, do not rewrite**.

### Palette (bank-grade tuning)
- **Teal `#0F766E`** — primary. Matches the logo gradient origin. Unchanged.
- **Sky `#38BDF8`** — accent, **demoted to hairline use only**: thin rules, focus rings, link underlines, circuit node dots, small pulses. No large ambient glows.
- **Background** — deepen toward near-black navy (slightly deeper than current `215 36% 6%`) for more institutional gravitas and better contrast under the circuit art.
- **Foreground / headings** — platinum near-white for headlines.
- **Muted-foreground** — cool steel for body/secondary text.
- Reduce the opacity of the global `bg-aura` / ambient layers in `(site)/layout.tsx` so the atmosphere reads calm, not glowing.

### Typography
- **Sora** (`--font-sans`) — body and headings. Headlines set at **light weight** (300) with tight negative tracking for the institutional feel.
- **Michroma** (`--font-brand`) — eyebrows, labels, the GYR wordmark, small uppercase tracked text.
- **IBM Plex Arabic** (`--font-arabic`) — the جير wordmark and any Arabic.

### Motion (restrained)
- One or two **traveling circuit pulses** + a few **blinking nodes** + a **breathing glow** on the falcon, layered over the static art.
- All motion gated behind `prefers-reduced-motion` (the existing media query already does this globally; new SVG animations must honor it too — render static when reduced).

### Circuit motif — fidelity decision
The falcon's wing circuitry is preserved exactly because we display the **real artwork** (`circuitsdark.png` / the emblem PNG). The ambient SVG layer **extends** that language and must match it:
- **Color:** teal→cyan linear gradient oriented like the wing (deep teal at origin, bright sky-cyan at tips), not flat teal.
- **Direction:** traces fan up-and-to-the-right, mirroring the wing sweep, so they read as a continuation of the emblem.
- **Distribution:** nodes denser near the emblem, sparser/brighter toward the tips.

**Chosen fidelity: "Matched SVG"** — author the ambient traces to follow the wing's color/direction/distribution. Lightweight, fully themeable, recolors with the palette tokens. (A "1:1 vector-trace" of the PNG wing was considered and rejected as heavier and less tunable; the real art already carries true fidelity where it matters — the emblem itself.)

---

## 4. Reusable Component Library

These components are the mechanism that keeps **both** coded pages and CMS-authored pages on-brand. Each has one clear purpose and a small, well-defined prop surface.

| Component | Purpose | Notes |
|---|---|---|
| `Hero` | Full above-the-fold hero | Slots: eyebrow, headline, sub, actions, emblem/visual. Used by Home; a lighter variant by About. |
| `CircuitPulse` | Animated SVG overlay (pulses, blinking nodes, breathing glow) | Layers on top of static art. Honors reduced-motion. Props for density + origin. |
| `CircuitBackground` | Static circuit/texture plate wrapper | Wraps `circuitsdark.png`, darkened for text contrast. |
| `SectionHeading` | Eyebrow (Michroma) + title + optional intro | Consistent section openers site-wide. |
| `BrandCard` | Glassy bordered surface that lifts on hover | Reuse/refine existing `.brand-card`. |
| `CircuitDivider` | Hairline rule with a node accent | Reuse/refine existing `.rule-glow`. |
| `TrustStrip` | "Trusted in production by" logo row | The #1 credibility signal for bank buyers. Accepts client logos or anonymized placeholders. |
| `PageHeader` | Branded header for **any** page | Applied to CMS catch-all pages so editor content is on-brand by default. |
| `Prose` (restyle) | Renders CMS Tiptap `body` | Re-theme to bank-grade: platinum headings, teal bullets, sky links, circuit-divider `hr`. Existing component, restyle only. |

---

## 5. Pages

### Home — `/` (coded `customLayout` page)
Sections, top to bottom:
1. **Hero** — animated, real `backgrounddark.png` plate. Eyebrow: `AI SOFTWARE FOR FINANCIAL INSTITUTIONS`. Headline: *"Intelligent software banks run on."* (thin weight, "run on." in teal). Sub: regulated/mission-critical framing. Actions: `SEE WHAT WE BUILD` (primary), `OUR STORY` (secondary → /about). Emblem (transparent falcon) right with `CircuitPulse`.
2. **TrustStrip** — "Trusted in production by" + client/bank logos (real or anonymized — see open item).
3. **What we build** — 3 `BrandCard`s on circuit texture. Working triad: **Intelligence · Automation · Assurance** (AI products, automated operations, regulated-grade reliability). Final copy in planning.
4. **How we work** — the three pillars **Connect · Innovate · Elevate**, restated for AI/banking (no UAE Arabic-geography framing; keep Arabic pillar names as brand).
5. **Latest Insights** — pulls 3 most-recent published posts from the CMS (`getPublishedPosts()`), `BrandCard` style.
6. **Closing CTA band** — falcon mark, "Ready to build with GYR?", contact CTA.

### About / Story — `/about` (coded `customLayout` page)
1. **Hero-lite** — vertical lockup + circuits, no TrustStrip.
2. **Mission** — "AI software banks run on", what GYR is and who it's for.
3. **Pillars expanded** — Connect · Innovate · Elevate with detail.
4. **Values** — Vision · Innovation · Trust · Precision · Leadership.
5. **Closing CTA**.

**Editability decision (default, overridable):** About is a **coded shell** (hero, pillars, values, CTA are designed/coded) with a **CMS-editable rich-text middle region** for the mission/story prose, so editors can update the narrative without a developer. Implemented by reading a known CMS `Page` (e.g. slug `about`) `body` into the coded layout's middle slot, rendered via the restyled `Prose`. If this proves awkward in planning, fall back to fully-coded.

### Insights — `/blog` (CMS-driven, restyled)
- **List** — branded `PageHeader` + post cards (cover image, title, excerpt, tags). Keep route `/blog`; nav label remains "Insights".
- **Article** — `/blog/[slug]`, restyled with new `Prose` theme, `CircuitDivider`, author, and a falcon footer mark.

### Contact (default: section + footer form, not a page)
Lightweight conversion path without a full page: a contact CTA band on Home/About and a **footer contact form / email + links**. Gives bank buyers a way in while honoring the 3-page scope. (Overridable to a full `/contact` page if desired.)

---

## 6. CMS Integration (explicit)

The CMS (`Page` model with `customLayout`, `showInNav`, `navOrder`; `Post` model for Insights) is respected as-is. **No schema migration required.**

- **Coded pages (Home, About):** registered as `Page` records with `customLayout: true` (so the admin list sees/badges them and nav can include them), while the actual rendering is owned by explicit coded React routes. The `[...slug]` catch-all already 404s `customLayout` pages so the coded route wins — this design relies on that existing behavior.
- **Editor-created pages:** continue to render through the catch-all using `Prose` — now wrapped in branded `PageHeader` + restyled `Prose`, so any new page is on-brand by default.
- **Nav:** `SiteHeader` becomes **Home (logo) · About · Insights · Contact**, plus appended `showInNav` CMS pages. Drop the hardcoded Team link.
- **About CMS-editable middle:** reads `Page` slug `about` body when present; renders nothing extra if absent.

---

## 7. Asset & Housekeeping Tasks
- Chroma-key transparent falcon variants; wire into nav, hero, footer, closing band.
- Generate favicons + OG image from lockups.
- Update the `gyr-visual-identity` memory to reflect new `/public` asset names and the deletion of `public/brand/*`.
- Remove UAE/geography copy and motifs across components.
- `.superpowers/` is gitignored (brainstorm scratch).

---

## 8. Success Criteria
1. Home, About, and Insights render in the refined bank-grade system with real fonts and transparent falcon (no box seam).
2. The circuit motif reads as one continuous system between the logo art and the ambient SVG layer; motion is subtle and respects reduced-motion.
3. A freshly CMS-authored page renders on-brand with zero extra work (branded `PageHeader` + `Prose`).
4. No UAE/geographic positioning remains anywhere on the public site.
5. Nav, footer, and CTAs give bank buyers a clear contact path.

---

## 9. Open Items (defaulted; confirm or override in planning)
1. **About editability** — defaulted to coded shell + CMS-editable middle. (Alt: fully coded.)
2. **Contact** — defaulted to section + footer form. (Alt: full `/contact` page.)
3. **Client logos** — does GYR have real bank/client logos to show, or do we use anonymized/"confidential" placeholders in `TrustStrip`?
4. **Nav lockup** — full horizontal lockup vs. emblem + "GYR" in the header (lean: horizontal lockup, with emblem-only on mobile).
5. **Team route** — remove `/team` entirely, or leave dormant/unlinked?
