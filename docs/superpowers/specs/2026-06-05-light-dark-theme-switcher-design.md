# Light/Dark Theme Switcher — Design

**Date:** 2026-06-05
**Branch:** `build/gyrsite-v1`
**Status:** Approved design, ready for implementation plan

## Goal

Add a light/dark theme switcher to the GYR site. The site is currently
dark-mode-first (a single dark `:root` token set in `src/app/globals.css`, no
theme mechanism). Light-variant brand assets already exist in `public/`; this
work wires up a real theme system, a bank-grade light palette, per-theme asset
swapping, and a toggle control.

## Decisions (locked)

- **First-visit behavior:** follow the OS preference (`prefers-color-scheme`).
- **Persistence:** once the user clicks the toggle, that explicit choice is
  saved and wins on return (system is only the pre-choice default).
- **Scope:** both the public marketing site **and** the `/admin` CMS.
- **Toggle placement:** in the header nav, next to the language switcher.
- **Engine:** `next-themes` (not hand-rolled).
- **Asset swap:** hybrid — `<Image>` toggle for the logo, CSS `background-image`
  swap for the large decorative plates.

## Why these choices

- **`next-themes`** handles system detection, `localStorage` persistence, the
  pre-paint no-flash script, cross-tab sync, and `color-scheme` — exactly the
  edge cases a hand-rolled solution would have to re-implement and get subtly
  wrong.
- **One provider location covers everything.** `<html>` is rendered once, in
  `src/app/[locale]/layout.tsx`, and *both* the public site (`(site)/`) and the
  CMS (`admin/`) are nested under `[locale]/`. A single `ThemeProvider` there
  satisfies the site-plus-CMS scope.
- **Hybrid asset swap** avoids double-downloading the ~1.4 MB plates: large
  decorative plates are `aria-hidden`, so swapping them via CSS
  `background-image` means only the active theme's plate is fetched. The logo is
  small and is real content (needs `alt`), so it stays as dual `<Image>`s.

## Architecture

### 1. Theme engine & no-flash

- Add the dependency with **pnpm** (never npm): `pnpm add next-themes`.
- New client component `src/components/theme-provider.tsx`:

  ```tsx
  "use client";
  import { ThemeProvider as NextThemesProvider } from "next-themes";

  export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    );
  }
  ```

  - `attribute="class"` → next-themes sets `class="light"` / `class="dark"` on
    `<html>`. Our CSS keys off `.light`; `class="dark"` is a harmless no-op
    because `:root` is already the dark palette.
  - `enableColorScheme` is on by default, so `color-scheme` is managed for us
    (native form controls, scrollbars).
  - `disableTransitionOnChange` prevents a color-fade flash when switching.

- In `src/app/[locale]/layout.tsx`:
  - Add `suppressHydrationWarning` to the `<html>` element (next-themes mutates
    its class before paint; this silences the expected hydration diff).
  - Wrap the existing `NextIntlClientProvider` with `<ThemeProvider>` inside
    `<body>`.

### 2. Light palette (`src/app/globals.css`)

Keep the existing `:root { … }` dark block **unchanged** — it remains the
no-JS / default fallback and the brand's primary face. Add a sibling `.light`
block that overrides the same tokens with a bank-grade light set. Starting
values (HSL channel triples, matching the existing `hsl(var(--token))` pattern):

```css
.light {
  --brand-teal: 175 72% 32%;
  --brand-sky: 198 90% 42%;   /* darkened so accents read on white */
  --brand-slate: 215 20% 45%;

  --background: 210 40% 98%;   /* cool near-white */
  --foreground: 210 45% 12%;   /* deep navy ink */
  --card: 0 0% 100%;
  --card-foreground: 210 45% 12%;
  --popover: 0 0% 100%;
  --popover-foreground: 210 45% 12%;
  --primary: 175 77% 30%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 30% 92%;
  --secondary-foreground: 210 45% 16%;
  --muted: 210 30% 94%;
  --muted-foreground: 215 16% 42%;  /* steel grey, AA on white */
  --accent: 210 30% 92%;
  --accent-foreground: 198 80% 36%;
  --destructive: 0 72% 48%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 20% 85%;
  --input: 214 20% 85%;
  --ring: 198 85% 45%;
}
```

> These values are a **tunable starting point**. Final values are confirmed
> during visual QA against the light brand plates, checking text contrast
> (target WCAG AA for body/`muted-foreground`).

### 3. Dark-only effects that need a `.light` variant

These are tuned for a dark canvas and look wrong on light unless adjusted:

- **`.bg-grid` / `.bg-aura`** — the sky/teal line and aura opacities (`0.05`,
  `0.12`, `0.06`) are calibrated for a near-black canvas; raise them under
  `.light` so the grid and aura remain perceptible on white.
- **Header circuit texture** uses `mix-blend-screen` (screen *lightens* → near
  invisible on white). Under `.light` it must use `mix-blend-multiply`. Because
  this class is applied in `site-header.tsx` markup, the light override is done
  with a Tailwind arbitrary variant on the element (e.g.
  `mix-blend-screen [.light_&]:mix-blend-multiply`) rather than in `globals.css`.
- **`.prose`** block — add light-tuned `--tw-prose-*` values (body, headings,
  links, code background) under `.light`.

### 4. Asset swapping

Current hardcoded dark assets and their fate:

| Location | Current | Light approach |
|---|---|---|
| `site-header.tsx` logo | `/logo-horizontal.png` | dual `<Image>`: `/logoHorizentaldark.png` + `/logoHorizentallight.png`, CSS-toggled |
| `site-header.tsx` circuit | `/circuitsdark.png` (`<Image>`) | decorative `<div>` w/ CSS `background-image`, `.light` → `/circuitslight.png` |
| `hero.tsx` plate | `/backgrounddark.png` (`<Image>`) | decorative `<div>` w/ CSS `background-image`, `.light` → `/backgroundlight.png` |
| `brand/circuit-background.tsx` | `/circuitsdark.png` (`<Image>`) | decorative `<div>` w/ CSS `background-image`, `.light` → `/circuitslight.png` |
| `brand/falcon.tsx` | `/falcon.png` | unchanged (transparent teal mark reads on both) |

**Logo (dual `<Image>`):** render both lockups; default shows the dark lockup,
`.light` ancestor selector hides it and shows the light one. Keeps `next/image`
optimization and `alt="GYR"`. Example pattern:

```tsx
<Image src="/logoHorizentaldark.png"  className="… block [.light_&]:hidden" … />
<Image src="/logoHorizentallight.png" className="… hidden [.light_&]:block" … />
```

(The standalone `/logo-horizontal.png` becomes unused and can be left in place
or removed; not load-bearing either way.)

**Decorative plates (CSS `background-image`):** convert each `<Image>` layer to
an `aria-hidden` `<div>` whose background image swaps on `.light`, so only the
active plate is downloaded. Preserve existing visual treatment:

- `object-cover` → `background-size: cover`
- `object-right` → `background-position: right center`
- `rtl:-scale-x-100` → `transform: scaleX(-1)` under `[dir="rtl"]` (or the
  `rtl:` variant) on the decorative `<div>`
- existing `opacity` / mask / gradient-overlay siblings are kept as-is.

Implementation detail: the background URLs are applied via Tailwind arbitrary
properties (e.g. `bg-[url(/backgrounddark.png)] [.light_&]:bg-[url(/backgroundlight.png)]`)
or a small dedicated utility class in `globals.css` — whichever the implementor
finds cleaner; both download only the matched rule's asset.

**Trade-off (accepted):** the three converted plates lose `next/image`
optimization. They are large source PNGs; a *future, optional* follow-up could
pre-optimize them with the existing `sharp` script pattern. Out of scope here.

### 5. Toggle component

New client component `src/components/site/theme-toggle.tsx`:

- Uses `useTheme()` from next-themes and a `mounted` guard (render a neutral
  same-size placeholder until mounted) so the icon never flashes the wrong
  state on hydration.
- Sun / Moon icons from `lucide-react` (already a dependency).
- Toggles between light and dark based on `resolvedTheme` (so a click from the
  system-resolved state does the intuitive thing).
- Styled to match `LocaleSwitcher` exactly: same `font-brand`, border, padding,
  rounded, hover (`hover:border-sky/60 hover:text-foreground`) treatment.
- `aria-label` pulled from messages (see i18n below), not hardcoded.

Placed in `site-header.tsx` immediately next to `<LocaleSwitcher />`.

### 6. CMS toggle

Add the same `<ThemeToggle />` to the authenticated CMS header in
`src/app/[locale]/admin/layout.tsx` (next to the existing `LogoutButton`). The
provider already wraps this subtree, so only the control needs adding.

### 7. i18n

Add a `theme` namespace to `messages/en.json` and `messages/ar.json`:

```jsonc
"theme": {
  "label": "Toggle theme",      // ar: "تبديل السمة"
  "toLight": "Switch to light",  // ar: "التبديل إلى الفاتح"
  "toDark": "Switch to dark"     // ar: "التبديل إلى الداكن"
}
```

The toggle uses `useTranslations("theme")` for its `aria-label`/title. (Final
Arabic wording confirmed during implementation.)

## Files touched

- `package.json` — add `next-themes` (via pnpm)
- `src/app/globals.css` — `.light` token block; `.light` prose; bg-grid/aura tuning
- `src/app/[locale]/layout.tsx` — `suppressHydrationWarning`; wrap with provider
- `src/components/theme-provider.tsx` — **new**
- `src/components/site/theme-toggle.tsx` — **new**
- `src/components/site/site-header.tsx` — logo pair, circuit `<div>`, toggle
- `src/components/site/hero.tsx` — hero plate `<div>`
- `src/components/site/brand/circuit-background.tsx` — circuit `<div>`
- `src/app/[locale]/admin/layout.tsx` — toggle in CMS header
- `messages/en.json`, `messages/ar.json` — `theme` namespace

## Edge cases & risks

- **No flash on first paint** — guaranteed by next-themes' pre-paint script +
  `suppressHydrationWarning`; the imagery swaps via CSS keyed on the same class,
  so it's correct on first paint too (no client `useTheme` round-trip for
  images).
- **No flash on switch** — `disableTransitionOnChange`.
- **Toggle icon hydration flash** — prevented by the `mounted` guard.
- **RTL** — the hero/circuit mirror (`scaleX(-1)`) must survive the `<Image>` →
  `<div>` conversion; verify in Arabic.
- **CMS legibility** — admin uses `bg-muted/20`, `border`, `text-muted-foreground`;
  all are tokens that swap, so it should adapt, but verify the login screen and
  sidebar in both themes.
- **Contrast** — light `muted-foreground` and `accent-foreground` must hit
  WCAG AA on white; confirm during QA.

## Verification

1. `npx tsc --noEmit` — primary correctness gate.
2. `pnpm build` — production build passes.
3. Manual via `pnpm dev`:
   - First load with OS set to light → site loads light; OS dark → loads dark.
   - Click toggle → switches; reload → choice persisted (overrides OS).
   - No flash of wrong theme on load; no color-fade flash on switch.
   - Network panel: only the active theme's plate downloads (not both).
   - Header circuit texture visible in **both** themes.
   - Logo swaps correctly per theme.
   - Arabic (`/ar`): RTL hero/circuit mirror intact in both themes.
   - CMS (`/admin`): header toggle works; sidebar, login, and content legible
     in both themes.

## Out of scope

- Pre-optimizing the large light/dark plate PNGs (possible future `sharp` pass).
- Per-route or time-of-day automatic theming.
- Theming the Tiptap editor chrome beyond what token-swapping already covers.
