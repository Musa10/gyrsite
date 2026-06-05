# GYR Visual Rebrand — Swiss Monochrome Precision

**Status:** Approved design (brainstorming complete) · **Date:** 2026-06-06 · **Branch:** `build/gyrsite-v1`

## 1. Overview

A full visual rebrand of the GYR site. The business positioning is unchanged — bank-grade
fintech infrastructure sold to banks and financial institutions — but the visual system is
replaced. The current identity (dark-first, teal/sky/slate, circuit motifs, glowing nodes,
detailed falcon) is retired in favor of a **Swiss / precision-tech** system: monochrome,
grid-driven, typography-led, restrained.

The new minimal "Gyr Technology" wordmark is the anchor for this direction.

### Design pillars

- **Precision** — grid-aligned, hairline rules, deliberate spacing.
- **Restraint** — no decorative color, no ambient glow, no busy texture.
- **Institutional trust** — clarity and rigor read as credibility to a banking audience.

In a monochrome system, **hierarchy is carried by scale, weight, and whitespace** rather than
color, and **typography is the primary expressive instrument**. That constraint *is* the brand.

## 2. Goals & non-goals

**Goals**
- Replace the brand visual system across the public site, the CMS/admin, and the Arabic/RTL surface.
- Establish a monochrome token set + hairline utilities that all components consume.
- Carry the existing light/dark toggle forward as a clean inversion of one token set.
- Keep all existing functionality, routes, i18n, and content model intact.

**Non-goals**
- No change to positioning, copy strategy, information architecture, or routes.
- No change to the CMS data model, auth, or server/data layers.
- No new pages or features — this is a restyle, not a rebuild.
- Logotype redesign is out of scope; we consume the supplied logo, we don't redraw the wordmark.

## 3. The design system

### 3.1 Color — pure monochrome

Light is the **default** theme. Dark mode is a **pure inversion** of the same token set (no
second palette). Color is reserved exclusively for functional UI states and never used decoratively.

| Token | Light | Dark (inverted) | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#0A0A0A` | Page canvas |
| `surface` | `#FAFAFA` | `#161618` | Raised/inset panels |
| `ink` | `#0A0A0A` | `#FAFAFA` | Primary text, solid buttons |
| `ink-2` | `#3F3F46` | `#D4D4D8` | Secondary text |
| `muted` | `#71717A` | `#A1A1AA` | Tertiary text, labels |
| `line` | `#E4E4E7` | `#27272A` | Hairline borders, grid |
| `line-2` | `#D4D4D8` | `#3F3F46` | Stronger borders, inputs |

**Functional states (only):** `success #16A34A`, `error #DC2626`, `warning #D97706`. These appear
in form validation, status tags, and alerts — never as brand or decoration. They are tuned per
theme for AA contrast on their backgrounds.

**Data emphasis:** charts/metrics use a grayscale ramp by default. If a single highlight is ever
needed, it draws from `ink`, not a hue. No teal, no sky, no slate.

### 3.2 Typography

- **Display / headings:** Space Grotesk (600/700), tight tracking (`-0.03em`). Distinctive,
  engineered character — this is what makes the monochrome brand ownable.
- **Body / UI:** Inter (400/500/600), comfortable measure, neutral.
- **Arabic / RTL:** IBM Plex Sans Arabic (already in the project) as the body+display face for
  Arabic, so the Arabic surface holds the same precise, neutral voice. No letter-tracking on
  Arabic (it breaks letter-joining); tracking applies to Latin eyebrows/labels only.

**Type roles:** Display (Space Grotesk 700) · Heading (Space Grotesk 600) · Subheading/label
(Inter 600) · Body (Inter 400) · Eyebrow/mono-label (Inter 600, uppercase, `0.14em`).

### 3.3 Iconography & motif

- **Primary mark:** the geometric arrow/wing from the logo, rebuilt as an **inline SVG** so it is
  resolution-independent and inverts for dark mode with no second asset.
- **Falcon:** "Arrow primary + minimal falcon accent." A single-weight geometric gyrfalcon
  silhouette is reserved for rare use only — favicon and an optional large faint section
  watermark — preserving the "Gyr" heritage without cluttering the system. *(See §6 — asset to be
  drafted as SVG for approval.)*
- **Texture:** a faint **hairline grid** is the only ambient texture, used sparingly (e.g. behind
  the hero, masked to fade out). Replaces the circuit background.
- **Icons:** thin-stroke (1.4–1.5px) geometric line icons, monochrome.

### 3.4 Components

- **Buttons:** primary (solid `ink`, inverted text), secondary (hairline `line-2` border, `ink`
  text), ghost (text + arrow, no chrome). Radius 6–8px.
- **Cards:** hairline-bordered, grouped in bordered grids with shared dividing rules (not floating
  shadowed boxes). Numbered (`01`/`02`/`03`) where it reinforces structure. No glow/lift glow;
  hover is a subtle border-darken or translate, not a colored shadow.
- **Inputs:** `line-2` border, `surface`/`bg` fill, `ink` focus ring (no colored ring).
- **Tags/pills:** hairline outline or solid `ink`. Status tags may use functional colors.
- **Density:** generous — large hero scale, roomy section padding, hairline dividers between bands.

### 3.5 Layout & grid

- Swiss grid: consistent max-width, multi-column structure, asymmetric hero, strong left
  alignment, hairline rules separating bands. Whitespace is structural, not incidental.
- RTL mirrors the grid; logical properties (`margin-inline`, `padding-inline`) and `dir`-aware
  layout already in use are preserved.

### 3.6 Motion

Restrained only: short fade/slide-in on scroll (≈`fade-up`), quick state transitions. **Removed:**
glow, breathe, float, draw, drift, circuit-pulse, node-blink. All motion honors
`prefers-reduced-motion`.

## 4. Surfaces in scope

1. **Public marketing site** — homepage + all `(site)`/`[locale]` pages, blog, team, footer, CTA.
2. **Admin / CMS** (`/admin`) — restyled to the same tokens and component language.
3. **Arabic / RTL parity** — full system applied and mirrored, with Plex Arabic type.
4. **Dark toggle** — carried forward as the inverted token set.

## 5. Current → new mapping (file-level)

This grounds the implementation plan; exact steps are produced by writing-plans.

**`src/app/globals.css`** — the largest change:
- Replace brand tokens (`--brand-teal/-sky/-slate`) and the shadcn scale values with the
  monochrome token set above.
- **Flip the theme-class convention.** Today `:root` holds the dark palette and `.light`
  overrides it; for a light-default system, `:root` holds the **light** palette and a `.dark`
  class overrides it. This means: set `color-scheme`/`:root` to light values, add `.dark { … }`,
  update `next-themes` `defaultTheme` (in `theme-provider.tsx`) from `"system"` to `"light"` (or
  keep `system` but ensure light is the unset baseline), and rewrite every component selector that
  branches on `[.light_&]` to branch on `[.dark_&]` (e.g. `site-header.tsx`).
- Remove `.plate-hero`/`.plate-circuit` (and the `/backgrounddark.png`, `/backgroundlight.png`,
  `/circuitsdark.png`, `/circuitslight.png` machinery), `.bg-aura`, `.text-gradient`, glowing
  `.diamond`, and the glow/float/draw/drift/pulse/blink/breathe keyframes.
- Keep/retune: `.bg-grid` (now a neutral hairline grid), `.rule-glow` → `.rule` (plain hairline),
  `.brand-card` → hairline card, `fade-up`, prose variables (recolored to monochrome).

**`src/app/[locale]/layout.tsx`** — swap fonts: `Sora`+`Michroma`+`Geist_Mono` → **Space Grotesk**
(display) + **Inter** (body), keep **IBM Plex Sans Arabic**. Update `--font-*` variables and the
`@theme inline` `--font-sans`/`--font-display` mappings. Regenerate `icons`/`openGraph` asset
references for the new monochrome favicons + OG image.

**`src/components/site/site-header.tsx`** — new logo (inline SVG arrow mark + supplied wordmark,
theme-inverted via CSS, no twin PNGs), remove the `plate-circuit` texture div, replace the
teal→sky hover underline with an `ink` underline, and migrate the `[.light_&]` logo-swap branches
to the new `.dark` convention (or drop them, since one inline SVG now serves both themes). Keep
`ThemeToggle` + `LocaleSwitcher`. **`theme-toggle.tsx`** — swap the `hover:border-sky/60` accent
for a neutral `ink`/`foreground` hover.

**`src/components/site/brand/`** — `logo.tsx` rebuilt around the arrow SVG + supplied wordmark;
`falcon.tsx` reduced to the minimal geometric silhouette (favicon/watermark); **delete**
`circuit-background.tsx` and `circuit-pulse.tsx`.

**`src/components/site/*`** — `hero.tsx`, `trust-strip.tsx`, `contact-cta.tsx`,
`section-heading.tsx`, `page-header.tsx`, `prose.tsx`, `site-footer.tsx`: restyle to the
monochrome tokens, Space Grotesk headings, hairline structure; strip glow/gradient utilities.

**`src/components/ui/*`** — primitives (button/card/input/etc.) already consume CSS-variable
tokens, so they re-skin largely by the `globals.css` token swap; variant tweaks (rings, hover) as
needed.

**`src/components/admin/*` + admin layout/header** — apply tokens + component language so the CMS
matches; `sidebar.tsx`, forms, buttons.

## 6. Asset needs

**Provided by the user (in `public/`):**
1. `gyr-technology-logo-clean-outlined.svg` — full "Gyr Technology" wordmark + mark, outlined
   single-fill black paths (`viewBox 0 0 790 190`). Used for the nav wordmark.
2. `gyr-falcon-alone-clean.svg` — the geometric falcon/arrow mark, single black path
   (`viewBox 0 0 141 186`). This **is** the brand symbol (the falcon and the arrow are one shape),
   so no separate falcon needs drafting. Used for the icon-only mark, favicon source, and the
   optional faint section watermark.

Both are pure `fill="#000000"`; switching the fill to `currentColor` makes them inherit
`text-foreground` and invert automatically between light and dark — no twin PNGs, no dark-mode
asset. They should be inlined as React SVG components (under `src/components/site/brand/`) rather
than `<img>`, so `currentColor` and sizing work.

**Generated in-repo (no user asset needed):**
3. **Favicons + OG image** — regenerated monochrome from the falcon mark (`favicon-32/48.png`,
   `apple-touch-icon.png`, `og.png`).

**Removed assets:** `logo-horizontal*.png`, `backgrounddark/light.png`, `circuitsdark/light.png`,
and other circuit/teal-era plates. `logo.png` may be kept as a raster fallback or removed.

## 7. Accessibility

- All text/background pairs meet WCAG AA (the monochrome ramp is chosen for this); functional
  state colors tuned for AA on their surfaces, in both themes.
- Focus visible via an `ink` (light) / `bg`-contrasting (dark) ring on all interactive elements.
- Links in prose carry an underline (no color to rely on).
- `prefers-reduced-motion` respected for all motion.
- RTL parity verified for mirrored layout and Arabic type.

## 8. Verification

- `npx tsc --noEmit` clean.
- `pnpm build` succeeds.
- Manual pass via `pnpm dev`: homepage, an interior page, blog, team, `/admin`, in **EN + AR** and
  **light + dark** — confirming no residual teal/circuit, correct fonts, AA contrast, working toggle.

## 9. Decisions log

| Decision | Choice |
|---|---|
| Scope | Full rebrand, positioning unchanged |
| Aesthetic | Swiss / precision-tech |
| Base | Light Precision — light default, dark as toggle |
| Color | Pure monochrome; color = functional states only |
| Type | Space Grotesk (display) + Inter (body) + Plex Arabic (RTL) |
| Mark | Arrow primary + minimal falcon accent |
| Surfaces | Public site + Admin/CMS + Arabic/RTL + dark toggle |
