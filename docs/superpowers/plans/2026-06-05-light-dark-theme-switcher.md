# Light/Dark Theme Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a system-aware light/dark theme switcher (with remembered manual override) to the public site and CMS, including a bank-grade light palette and per-theme brand-asset swapping.

**Architecture:** `next-themes` sets `class="light"`/`"dark"` on `<html>` (mounted once in `src/app/[locale]/layout.tsx`, which covers both `(site)/` and `admin/`). `globals.css` keeps `:root` as the dark palette and adds a `.light` override block plus theme-swapped decorative-plate classes. Large decorative plates swap via CSS `background-image` (only the active asset downloads); the small nav logo swaps via dual `<Image>` toggled by a `.light` ancestor selector.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, next-intl, next-themes, lucide-react, sharp (build-time asset script).

**Testing note (overrides the skill's default TDD loop):** Per `CLAUDE.md`, this repo has **no component/CSS test harness** — vitest covers only pure helpers, and "most verification is `npx tsc --noEmit` + `pnpm build` + manual checks via `pnpm dev`." This feature is entirely UI/CSS/wiring with no pure logic to unit-test, so each task is verified with `npx tsc --noEmit` (and `pnpm build` / manual QA at the end) instead of unit tests. Use **pnpm only — never npm** (also per `CLAUDE.md`).

---

## File structure

**Create:**
- `src/components/theme-provider.tsx` — client wrapper around next-themes' `ThemeProvider`.
- `src/components/site/theme-toggle.tsx` — client sun/moon toggle button.
- `scripts/make-logo-light.mjs` — one-off sharp script: key the white background out of `logoHorizentallight.png` and trim → `public/logo-horizontal-light.png`.

**Modify:**
- `package.json` / lockfile — add `next-themes` (via `pnpm add`).
- `src/app/globals.css` — `.light` token block, `.light` bg-grid/aura tuning, theme-swapped plate classes.
- `src/app/[locale]/layout.tsx` — `suppressHydrationWarning` on `<html>`, wrap with `<ThemeProvider>`.
- `messages/en.json`, `messages/ar.json` — add `theme` namespace.
- `src/components/site/site-header.tsx` — dual logo, circuit `<div>`, mount `<ThemeToggle />`.
- `src/components/site/hero.tsx` — hero plate `<div>`.
- `src/components/site/brand/circuit-background.tsx` — circuit `<div>`.
- `src/app/[locale]/admin/layout.tsx` — mount `<ThemeToggle />` in the CMS header.

---

## Task 1: Install next-themes and create the provider

**Files:**
- Modify: `package.json` (+ `pnpm-lock.yaml`) via pnpm
- Create: `src/components/theme-provider.tsx`

- [ ] **Step 1: Install the dependency (pnpm only)**

Run: `pnpm add next-themes`
Expected: `next-themes` appears under `dependencies` in `package.json`; `pnpm-lock.yaml` updates. (If this errors, do NOT fall back to npm — see `CLAUDE.md`.)

- [ ] **Step 2: Create the provider wrapper**

Create `src/components/theme-provider.tsx`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App-wide theme provider. `attribute="class"` makes next-themes set
 * `class="light"` / `class="dark"` on <html>; our CSS keys off `.light`
 * (`.dark` is a no-op because :root is already the dark palette).
 * `defaultTheme="system"` + `enableSystem` = follow the OS until the user
 * picks; the choice is then persisted in localStorage and wins on return.
 * `disableTransitionOnChange` prevents a color-fade flash when switching.
 */
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

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). The component isn't mounted yet; this just confirms the import resolves and types are valid.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/theme-provider.tsx
git commit -m "feat(theme): add next-themes provider wrapper"
```

---

## Task 2: Mount the provider in the locale layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Import the provider**

In `src/app/[locale]/layout.tsx`, add to the imports (after the existing import block, e.g. below the `@/i18n/routing` import):

```tsx
import { ThemeProvider } from "@/components/theme-provider";
```

- [ ] **Step 2: Add `suppressHydrationWarning` and wrap the tree**

Replace the returned JSX (the `return ( <html ...> ... </html> )` block) with:

```tsx
  return (
    <html
      lang={locale}
      dir={dir(locale)}
      suppressHydrationWarning
      className={`${sora.variable} ${michroma.variable} ${plexArabic.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-background text-foreground ${bodyFont}`}>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
```

(`suppressHydrationWarning` is required because next-themes mutates the `<html>` class before React hydrates — without it React logs an expected-mismatch warning.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Smoke-test in the browser**

Run: `pnpm dev`, open `http://localhost:3000`.
Expected: site still renders dark (no light tokens exist yet). In DevTools, `<html>` now carries `class="dark"` (or `light` if your OS is set light) added by next-themes. No console hydration warning about the `<html>` element.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat(theme): mount ThemeProvider over site + CMS"
```

---

## Task 3: Add the light palette and plate classes to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the `.light` token block**

In `src/app/globals.css`, immediately AFTER the closing `}` of the existing `:root { … }` block (currently ends at the line with `--ring: 198 93% 60%;` then `}`), insert:

```css
/*
 * Light theme — bank-grade. Applied when next-themes sets class="light" on
 * <html>. Values are tuned for AA contrast on a cool near-white canvas; teal
 * stays the primary accent, sky is darkened so it reads on white.
 */
.light {
  color-scheme: light;

  --brand-teal: 175 72% 32%;
  --brand-sky: 198 90% 42%;
  --brand-slate: 215 20% 45%;

  --background: 210 40% 98%;
  --foreground: 210 45% 12%;
  --card: 0 0% 100%;
  --card-foreground: 210 45% 12%;
  --popover: 0 0% 100%;
  --popover-foreground: 210 45% 12%;
  --primary: 175 77% 30%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 30% 92%;
  --secondary-foreground: 210 45% 16%;
  --muted: 210 30% 94%;
  --muted-foreground: 215 16% 40%;
  --accent: 210 30% 92%;
  --accent-foreground: 198 80% 34%;
  --destructive: 0 72% 48%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 20% 85%;
  --input: 214 20% 85%;
  --ring: 198 85% 45%;
}
```

- [ ] **Step 2: Tune the ambient motifs for light**

In the same file, find the `@layer components { … }` block. Inside it (e.g. right after the `.bg-aura { … }` rule closes), add light-mode overrides so the grid/aura — calibrated for a near-black canvas — stay visible on white:

```css
  /* Ambient motifs need stronger ink on a light canvas. */
  .light .bg-grid {
    background-image:
      linear-gradient(hsl(var(--brand-slate) / 0.1) 1px, transparent 1px),
      linear-gradient(90deg, hsl(var(--brand-slate) / 0.1) 1px, transparent 1px);
  }
  .light .bg-aura {
    background:
      radial-gradient(
        60% 60% at 80% 15%,
        hsl(var(--brand-teal) / 0.1),
        transparent 70%
      ),
      radial-gradient(
        50% 50% at 10% 90%,
        hsl(var(--brand-sky) / 0.08),
        transparent 70%
      );
  }
```

- [ ] **Step 3: Add the theme-swapped decorative-plate classes**

Still inside `@layer components { … }`, add:

```css
  /* Decorative brand plates — only the active theme's image downloads, because
     a CSS background-image is fetched only when its rule matches. Pair with
     Tailwind `bg-cover` + a position utility on the element. */
  .plate-hero {
    background-image: url("/backgrounddark.png");
  }
  .light .plate-hero {
    background-image: url("/backgroundlight.png");
  }
  .plate-circuit {
    background-image: url("/circuitsdark.png");
  }
  .light .plate-circuit {
    background-image: url("/circuitslight.png");
  }
```

Note: `.prose` needs **no** light block — it is defined entirely via the semantic tokens (`--muted-foreground`, `--foreground`, `--card`, `--brand-sky`) which already swap under `.light`, so it adapts automatically. (Confirm in QA, Task 11.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (CSS isn't typechecked, but this confirms nothing else broke).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): light palette, light motif tuning, plate swap classes"
```

---

## Task 4: Add the `theme` namespace to message catalogs

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ar.json`

- [ ] **Step 1: Add to `messages/en.json`**

Insert a `theme` block immediately AFTER the `switcher` block (after its closing `},` on the line following `"label": "Change language"`):

```json
  "theme": {
    "label": "Toggle theme",
    "toLight": "Switch to light",
    "toDark": "Switch to dark"
  },
```

- [ ] **Step 2: Add to `messages/ar.json`**

Insert the matching block immediately AFTER the `switcher` block (after `"label": "تغيير اللغة"` and its closing `},`):

```json
  "theme": {
    "label": "تبديل السمة",
    "toLight": "التبديل إلى الوضع الفاتح",
    "toDark": "التبديل إلى الوضع الداكن"
  },
```

- [ ] **Step 3: Validate JSON + typecheck**

Run: `node -e "require('./messages/en.json'); require('./messages/ar.json'); console.log('json ok')"`
Expected: prints `json ok` (no parse error — confirms no trailing-comma/brace mistakes).
Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/ar.json
git commit -m "i18n(theme): add theme-toggle labels (en, ar)"
```

---

## Task 5: Create the ThemeToggle component

**Files:**
- Create: `src/components/site/theme-toggle.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/site/theme-toggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

/**
 * Sun/moon theme toggle. Styled to match LocaleSwitcher. A `mounted` guard
 * renders a neutral placeholder until hydration so the icon never flashes the
 * wrong state (resolvedTheme is undefined on the server).
 */
export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const label = mounted ? (isDark ? t("toLight") : t("toDark")) : t("label");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-md border border-border/80 text-muted-foreground transition-colors hover:border-sky/60 hover:text-foreground"
    >
      {mounted ? (
        isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <span className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (If `Moon`/`Sun` fail to resolve from `lucide-react`, this is where it surfaces — both are standard lucide exports, so it should pass.)

- [ ] **Step 3: Commit**

```bash
git add src/components/site/theme-toggle.tsx
git commit -m "feat(theme): sun/moon ThemeToggle button"
```

---

## Task 6: Generate the light-theme nav logo

The dark nav logo (`public/logo-horizontal.png`) is a transparency-keyed, trimmed crop of the dark lockup (see `scripts/make-logo.mjs`). The light theme needs the equivalent from `logoHorizentallight.png`, whose background is **white** and marks are **dark teal** — so we key out high luminance (the inverse of `make-logo.mjs`).

**Files:**
- Create: `scripts/make-logo-light.mjs`
- Produces: `public/logo-horizontal-light.png`

- [ ] **Step 1: Write the script**

Create `scripts/make-logo-light.mjs`:

```js
// Extract a transparent, tightly-trimmed horizontal lockup for the LIGHT theme
// nav from the light lockup PNG (teal falcon + GYR + جير on white). Luminance-
// key the WHITE background to alpha (inverse of scripts/make-logo.mjs), then
// trim dead padding. If a white halo remains, lower HI; if light edges of the
// marks get eaten, raise LO. Re-run until clean.
import sharp from "sharp";

const SRC = "public/logoHorizentallight.png";
const OUT = "public/logo-horizontal-light.png";

// Background ~white (high luminance); marks dark teal (low luminance).
const LO = 200; // lum <= LO -> fully opaque (the marks)
const HI = 240; // lum >= HI -> fully transparent (white background)

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = info.channels;
for (let i = 0; i < data.length; i += px) {
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let a;
  if (lum >= HI) a = 0;
  else if (lum <= LO) a = 255;
  else a = Math.round(((HI - lum) / (HI - LO)) * 255);
  data[i + 3] = a;
}

await sharp(data, { raw: info })
  .png()
  .trim({ threshold: 0 })
  .toFile(OUT);

const m = await sharp(OUT).metadata();
console.log(`wrote ${OUT} ${m.width}x${m.height} ratio=${(m.width / m.height).toFixed(2)}`);
```

- [ ] **Step 2: Run it**

Run: `node scripts/make-logo-light.mjs`
Expected: prints `wrote public/logo-horizontal-light.png <W>x<H> ratio=<R>`. **Record the printed `<W>` and `<H>`** — they are used as the `width`/`height` of the light `<Image>` in Task 7, Step 2.

- [ ] **Step 3: Visually verify the asset**

Open `public/logo-horizontal-light.png`.
Expected: dark-teal "GYR / جير" + falcon, fully transparent background, no white halo, no eaten edges, tightly trimmed. If a white halo remains, lower `HI` (e.g. 230) and re-run; if mark edges are eaten, raise `LO` (e.g. 210) and re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/make-logo-light.mjs public/logo-horizontal-light.png
git commit -m "feat(theme): generate transparent light-theme nav logo"
```

---

## Task 7: Wire theme-swapping into the site header

**Files:**
- Modify: `src/components/site/site-header.tsx`

- [ ] **Step 1: Import the toggle**

In `src/components/site/site-header.tsx`, add below the existing `LocaleSwitcher` import:

```tsx
import { ThemeToggle } from "@/components/site/theme-toggle";
```

- [ ] **Step 2: Swap the logo for a theme-aware pair**

Replace the single logo `<Image>` (the `<Image src="/logo-horizontal.png" … />` block) with two images toggled by the `.light` ancestor selector. Use the dark logo's known dims (1387×402) and the light logo's dims printed in Task 6 Step 2 — substitute `LIGHT_W`/`LIGHT_H` below with those recorded numbers:

```tsx
          <Image
            src="/logo-horizontal.png"
            alt="GYR"
            width={1387}
            height={402}
            priority
            className="h-8 w-auto sm:h-9 [.light_&]:hidden"
          />
          <Image
            src="/logo-horizontal-light.png"
            alt="GYR"
            width={LIGHT_W}
            height={LIGHT_H}
            priority
            className="hidden h-8 w-auto sm:h-9 [.light_&]:block"
          />
```

(The `[.light_&]:` arbitrary variant compiles to `.light .selector { … }`; `<html class="light">` is the ancestor, so the dark logo hides and the light logo shows in light mode.)

- [ ] **Step 3: Convert the circuit texture to a CSS-swapped plate**

Replace the circuit texture block:

```tsx
      {/* Circuit-trace texture, faded so it never competes with the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/circuitsdark.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right opacity-[0.55] mix-blend-screen [mask-image:linear-gradient(to_left,black,transparent_60%)]"
        />
      </div>
```

with a single decorative `<div>` whose background swaps by theme (and whose blend mode flips on light, since `screen` is invisible on white):

```tsx
      {/* Circuit-trace texture, faded so it never competes with the content.
          background-image swaps by theme; only the active plate downloads. */}
      <div
        aria-hidden
        className="plate-circuit pointer-events-none absolute inset-0 bg-cover bg-right opacity-[0.55] mix-blend-screen [.light_&]:mix-blend-multiply [mask-image:linear-gradient(to_left,black,transparent_60%)]"
      />
```

- [ ] **Step 4: Mount the toggle next to the language switcher**

Replace the lone `<LocaleSwitcher />` near the end of the header with both controls wrapped in a flex row:

```tsx
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (`Image` is still imported and used by the logo pair, so its import stays.)

- [ ] **Step 6: Manual check**

Run: `pnpm dev`, open `/`.
Expected: header renders; toggle button visible next to the language switcher; clicking it flips the page between dark and light; the nav logo swaps colorway; the circuit texture is visible in both themes. Reload → the chosen theme persists.

- [ ] **Step 7: Commit**

```bash
git add src/components/site/site-header.tsx
git commit -m "feat(theme): theme-aware header (logo, circuit, toggle)"
```

---

## Task 8: Convert the hero background plate

**Files:**
- Modify: `src/components/site/hero.tsx`

- [ ] **Step 1: Replace the plate `<Image>` with a CSS-swapped `<div>`**

In `src/components/site/hero.tsx`, replace the `isFull` plate block:

```tsx
      {isFull && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src="/backgrounddark.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right opacity-90 rtl:-scale-x-100"
          />
          {/* Darken the text side; keep the falcon side clear. Flip on RTL. */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent rtl:bg-gradient-to-l" />
        </div>
      )}
```

with:

```tsx
      {isFull && (
        <div aria-hidden className="absolute inset-0 -z-10">
          {/* background-image swaps by theme; RTL mirror preserved via transform. */}
          <div className="plate-hero absolute inset-0 bg-cover bg-right opacity-90 rtl:-scale-x-100" />
          {/* Darken the text side; keep the falcon side clear. Flip on RTL. */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent rtl:bg-gradient-to-l" />
        </div>
      )}
```

- [ ] **Step 2: Remove the now-unused `Image` import**

`Image` is now unused in this file (the plate was its only use; `Falcon` is a separate component). Remove the line:

```tsx
import Image from "next/image";
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (If `Image` were left imported-but-unused, the build's lint step would flag it.)

- [ ] **Step 4: Manual check**

Run: `pnpm dev`, open `/`.
Expected: hero shows the dark plate in dark mode and the light plate in light mode; the text-side gradient still fades correctly; on `/ar`, the plate is mirrored to the opposite side. In DevTools Network, only the active theme's `background*.png` is requested.

- [ ] **Step 5: Commit**

```bash
git add src/components/site/hero.tsx
git commit -m "feat(theme): theme-swapped hero background plate"
```

---

## Task 9: Convert the full-page circuit background

**Files:**
- Modify: `src/components/site/brand/circuit-background.tsx`

- [ ] **Step 1: Replace the `<Image>` with a CSS-swapped `<div>`**

In `src/components/site/brand/circuit-background.tsx`, replace the `CircuitBackground` body:

```tsx
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    >
      <Image
        src="/circuitsdark.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.10]"
      />
      <div className="absolute inset-0 bg-background/40" />
    </div>
```

with:

```tsx
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    >
      <div className="plate-circuit absolute inset-0 bg-cover bg-center opacity-[0.10]" />
      <div className="absolute inset-0 bg-background/40" />
    </div>
```

- [ ] **Step 2: Remove the now-unused `Image` import**

`Image` is no longer used in this file. Remove:

```tsx
import Image from "next/image";
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/site/brand/circuit-background.tsx
git commit -m "feat(theme): theme-swapped circuit background"
```

---

## Task 10: Add the toggle to the CMS header

**Files:**
- Modify: `src/app/[locale]/admin/layout.tsx`

- [ ] **Step 1: Import the toggle**

In `src/app/[locale]/admin/layout.tsx`, add below the existing imports:

```tsx
import { ThemeToggle } from "@/components/site/theme-toggle";
```

- [ ] **Step 2: Mount it in the admin header**

Replace the admin header row:

```tsx
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <LogoutButton />
        </header>
```

with:

```tsx
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/admin/layout.tsx
git commit -m "feat(theme): theme toggle in CMS header"
```

---

## Task 11: Full verification + QA pass

**Files:** none (verification only).

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 2: Production build**

Run: `pnpm build`
Expected: build completes with no type/lint errors.

- [ ] **Step 3: Manual QA via `pnpm dev`**

Run: `pnpm dev` and verify each item:

- [ ] First load with OS set to **light** → site loads light; with OS **dark** → loads dark (clear `localStorage` between checks, or use a fresh profile).
- [ ] Click the toggle → theme switches; **reload** → the chosen theme persists and overrides the OS setting.
- [ ] **No flash** of the wrong theme on initial load (hard-refresh a few times); **no color-fade flash** on toggle.
- [ ] DevTools Network: only the **active** theme's `background*.png` / `circuits*.png` download — not both.
- [ ] Header circuit texture is visible in **both** themes (screen blend on dark, multiply on light).
- [ ] Nav logo swaps to the correct colorway per theme and is crisp (no distortion).
- [ ] `/ar`: hero/circuit plates are RTL-mirrored in **both** themes; the toggle's `aria-label` is Arabic.
- [ ] Body copy / blog (`.prose`) and `muted-foreground` text are legible (AA) on the light canvas; adjust the `.light` token values in `globals.css` if any text is too low-contrast.
- [ ] CMS (`/admin`, logged in): header toggle works; sidebar, content, and the login screen are legible in both themes.
- [ ] No console hydration warnings.

- [ ] **Step 4: Final commit (only if QA prompted token tweaks)**

If you adjusted any `.light` values during QA:

```bash
git add src/app/globals.css
git commit -m "fix(theme): tune light palette for AA contrast"
```

---

## Self-review notes (author)

- **Spec coverage:** engine/no-flash (T1–T2), light palette (T3), dark-only effect fixes — bg-grid/aura + header blend mode (T3, T7) — and prose (T3, determined no-op), asset swap — logo (T6–T7), hero/circuit plates (T7–T9), falcon unchanged (T8 leaves it) — toggle (T5, T7), CMS toggle (T10), i18n (T4), verification (T11). All spec sections map to tasks.
- **Deviation from spec §4 logo:** the spec said use `logoHorizentallight.png` directly; the raw lockup is 1672×941 with heavy padding (would render tiny), so the plan generates a trimmed, transparency-keyed `logo-horizontal-light.png` instead — matching the existing `make-logo.mjs` pattern. This is the correct realization of the intent.
- **Deviation from spec §2 prose:** determined to be a no-op (token-driven), documented in T3 Step 3.
- **Type/name consistency:** `ThemeProvider` (T1) imported in T2; `ThemeToggle` (T5) imported in T7 + T10; `.plate-hero`/`.plate-circuit` (T3) referenced in T7–T9; `theme` namespace keys `label`/`toLight`/`toDark` (T4) consumed in T5. Consistent.
- **No placeholders:** the only deferred value is the light logo's pixel `width`/`height` (`LIGHT_W`/`LIGHT_H`), which is intrinsic to the trim output — T6 Step 2 prints it and T7 Step 2 consumes it.
