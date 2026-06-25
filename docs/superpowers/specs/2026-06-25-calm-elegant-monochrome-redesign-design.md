# GYR Redesign v2 — Calm, Elegant, Monochrome (dual theme)

**Date:** 2026-06-25
**Branch:** `build/gyrsite-v1`
**Status:** Design locked, pending spec review → implementation plan
**Supersedes the visual language of:** `docs/superpowers/specs/2026-06-23-technical-instrument-redesign-design.md` (the "technical-instrument / warm-monochrome" direction). The information architecture, positioning, founder-forward approach, and content-pause discipline from that spec are **retained**; only the visual language is replaced.

---

## 1. Why this exists

The "technical-instrument" redesign (warm monochrome, spec-sheet layouts, calibrated-falcon, mono "instrument" labels) was built and rejected. Through a fresh design exploration the founder's actual taste surfaced clearly, in his words:

> **Simplicity and elegance. Colors from black to white. No "light bulbs" — calm.**

"Light bulbs" = the glow, chrome sheen, animated grids, radar sweeps, and shimmer that earlier iterations leaned on. The founder wants the **opposite of drama**: quiet, restrained, confident. Reference points that resonated: OpenAI and Teenage Engineering (minimal, calm, monochrome), with the gallery-like stillness of high-end editorial work.

Both a **white** and a **black** treatment of the same calm hero were shown and **both were loved** — so the site ships **both as first-class themes** (light + dark toggle), not one with the other as an afterthought.

## 2. Design principles (the soul)

1. **Calm over loud.** The page should feel still. Confidence comes from space and restraint, not effects.
2. **Elegant simplicity.** Few elements, perfectly placed. If something can be removed, remove it (YAGNI for visuals).
3. **Monochrome, true black→white.** Neutral greys only — no hue, no accent color. (Note: *neutral*, not the warm ink-on-paper of v1, which read as "lifeless." The greys are clean and neutral.)
4. **Type and space do the work.** Hierarchy from size, weight, and whitespace — not boxes, borders, or color.
5. **The mark is matte.** The falcon is presented flat in the current text color. **Never** chrome, glow, gradient-filled, or animated. Never recolored, never mirrored in RTL.
6. **Dual theme parity.** Light and dark are equally considered; every component is designed in both from the start.

## 3. What "calm / no light bulbs" means — explicit guardrails

**Banned** (these killed earlier iterations):
- Glows, drop-shadow halos, radial "spotlight" backgrounds
- Chrome / brushed-metal / metallic-gradient fills (on the falcon, text, or buttons)
- Animated grids, radar sweeps, scan lines, traveling-dot pipelines, shimmer
- Gradient mesh "auroras"; heavy gradients of any kind
- Decorative placeholder pills / dashed "content pass" badges visible in the design
- Dense templated blocks (the generic 3-card feature grid)

**Allowed:**
- Flat neutral fills; at most a single, barely-perceptible tonal shift between sections for rhythm
- Hairline rules (1px, low-contrast) used sparingly
- Generous whitespace as the primary compositional tool
- Quiet, optional motion only: short fade/translate on first view, smooth theme transition; **always** gated by `prefers-reduced-motion`
- Real, honest content and tasteful, intentional placeholder treatments (see §8)

## 4. Visual system

### 4.1 Color & dual theme
A small, neutral grayscale token set, defined once and flipped per theme in `src/app/globals.css` (`:root` = light, `.dark` = dark). Approximate anchors (exact values tuned in build):

| Token | Light | Dark |
|---|---|---|
| `--background` | `#FBFBFA` (near-white) | `#0D0E10` (near-black) |
| `--foreground` (ink) | `#15161A` | `#F3F3F1` |
| `--muted-foreground` (secondary text) | ~`#6B6C70` | ~`#9A9B9E` |
| `--hairline` (rules/borders) | `rgba(0,0,0,.10)` | `rgba(255,255,255,.12)` |
| `--surface` (subtle panel, if needed) | `#F4F4F2` | `#141518` |

- **No accent color.** Pure neutral. Saturation ≈ 0 (neutral grey, not warm).
- Functional state colors: there are no forms (contact is `mailto:`), so the palette stays purely monochrome. If a future state needs signalling, use weight/opacity, not hue.

### 4.2 Typography
**One Latin family, used masterfully** — simplicity and elegance from a single typeface across sizes/weights/tracking:
- **Inter** — `--font-sans`, the whole Latin system. Display = Inter at large size, **light/regular weight (300–500)** with tight tracking (`-0.02em`); body = Inter 400; emphasis = Inter 600.
- **Labels/eyebrows** — Inter, small, **uppercase, wide letter-spacing (~0.3em)**, low opacity. (Replaces the v1 monospace "instrument" labels — the techy mono fights elegance.)
- **Arabic** — **IBM Plex Sans Arabic** (`--font-arabic`), retained for the AR locale per the language-isolation policy.
- **Removed:** Space Grotesk (display) and IBM Plex Mono (instrument labels). The unlayered `[lang="ar"] …` rule in `globals.css` is simplified to map Arabic onto the Inter-driven display/label classes.

### 4.3 The falcon
`FalconMark` / `Logo` / `FALCON_PATH` in `src/components/site/brand/` are **unchanged**. The mark renders flat in `currentColor`, sized with a height utility. It appears matte in the hero (medium size, calm), in the nav wordmark, and in the footer. It is wrapped `dir="ltr"` anywhere inside RTL so it is **never mirrored**. No chrome, no glow, no animation, ever.

### 4.4 Layout, space, rhythm
- Centered, generous max-width (~1000–1040px) with ample horizontal margins.
- Vertical rhythm is large and even; sections breathe.
- Hairline rules separate sections sparingly; mostly whitespace separates them.
- Rhythm/variety (to avoid the "monotonous" failure) comes from **alternating composition and density** — a centered still hero, then asymmetric editorial blocks, then a quiet full-width statement — **not** from color, glow, or busy graphics.

### 4.5 Motion
Minimal by design. Permitted: a gentle fade/slide-in on first scroll into view; a smooth (~200ms) color transition when toggling theme. Nothing loops, pulses, glows, or sweeps. All motion respects `prefers-reduced-motion: reduce`.

### 4.6 Components
- **Header / nav** — minimal: wordmark (falcon + "GYR") left; a few quiet text links + Contact right; a calm theme toggle. Hairline bottom border, optional subtle blur on scroll (no heavy effect).
- **Hero** — centered, still: matte falcon, an uppercase eyebrow, a large light-weight headline (one emphasized word via weight, not color), one calm supporting line, one understated pill button + one text link. Lots of space. (This is the locked, loved composition.)
- **Section blocks** — editorial, not templated. Capabilities (AI Automation, Cybersecurity, Secure Integration) presented as a small number of calm, type-led entries with hairline separation and generous space — **not** a bordered card grid. Asymmetric where it adds elegance.
- **Process / approach** — a quiet numbered sequence (type + hairlines), calm.
- **Founder** — an elegant editorial block: a restrained portrait frame (intentional neutral treatment, not an apologetic placeholder box), a pull-quote in the display weight, name, role, LinkedIn link.
- **Contact / CTA** — a calm closing statement and the `mailto:contact@gyr.ae` action.
- **Footer** — minimal columns, hairline top, falcon wordmark.

## 5. Information architecture (retained from v1, re-expressed calmly)
Five pages, both locales (EN/AR), all statically prerendered, `localePrefix: "always"`:
- `/{en,ar}` — **Home**
- `/{en,ar}/services` — **Services**
- `/{en,ar}/approach` — **Approach**
- `/{en,ar}/about` — **About** (founder-forward; founder copy canonical here, reused on Home)
- `/{en,ar}/contact` — **Contact** (`mailto:` only, no backend)

Positioning retained: **AI automation + cybersecurity for enterprises generally** (finance one sector among several). Copy lives in `messages/{en,ar}.json` with EN/AR parity. Use the locale-aware `Link` from `@/i18n/navigation`.

## 6. Theme system
- Light is the default `:root`; `.dark` holds the dark token values. A **theme toggle** in the header switches them and persists the choice (respecting `prefers-color-scheme` on first visit).
- Every component is verified in **both** themes. `themeColor` metadata updates to the neutral near-white / near-black values.

## 7. Codebase changes (high level)
- **`globals.css`** — replace the warm ink-on-paper ramp with the neutral grayscale dual-theme tokens (§4.1); remove `.ins-*` instrument primitives and chrome/glow utilities; simplify the unlayered Arabic rule for the Inter-based label/display classes; add the small, calm motion utilities (reduced-motion-gated).
- **`layout.tsx`** — register Inter (+ IBM Plex Sans Arabic for AR); **remove Space Grotesk and IBM Plex Mono**; update `themeColor`.
- **Components** — retire the "instrument" kit (`spec-header`, `calibrated-falcon`, `index-table`, `process-sequence`, `capability-block`, `section-label`) and rebuild calm, elegant equivalents (or fold them into simpler section components). Rework `hero`, `site-header` (add theme toggle), `site-footer`, `contact-cta`, `founder-note`/`founder-profile`, `contact-panel` to the new language. Drop the visible `draft-flag` styling in favor of tasteful intentional treatments (§8).
- **`brand/`** — unchanged.
- **Content catalogs** — keep structure/keys; copy is reviewed/placeholder per §8 (no new factual claims).

## 8. Content governance & integrity (unchanged, handled tastefully)
The hard rule stands: **never publish unverified facts**, and **do not deploy until a separate content pass is approved.** What changes is *how* placeholders look — the apologetic dashed "content pass" pills are removed because they made the site read as unfinished. Instead:
- Where a real asset is pending (founder photo, client logos), use an **intentional neutral design treatment** that looks deliberate, never a fake.
- **No invented facts** — no fabricated client names/logos, certifications, metrics, or bios. Honest, non-factual framing copy and custom-but-truthful visuals only.
- Pending items tracked in the plan/code comments, not as visible badges: founder real bio + photo + title + Arabic name spelling; capability sub-lists; sectors list; location.
- `contact@gyr.ae` remains the single contact channel; confirm before any change.
- `NEXT_PUBLIC_SITE_URL` must be set at deploy.

## 9. Verification
No test harness. Gates: `npx tsc --noEmit` (primary), `pnpm lint`, `pnpm build` (all 10 routes prerender static), and manual `pnpm dev` review of **every page in both locales AND both themes**, confirming: calm/elegant feel, no banned effects (§3), RTL correct, falcon un-mirrored, reduced-motion honored.

## 10. Non-goals / YAGNI
- No CMS, DB, or auth (static-first stands).
- No accent color, no illustration system, no 3D, no scroll-jacking, no flashy motion.
- No new pages beyond the five.
- No deployment until the content pass is approved.

## 11. Deferred to the content pass
Founder bio/photo/title/Arabic-name spelling; capability sub-lists; sectors list; company location; numerals convention in AR; any real proof/clients.
