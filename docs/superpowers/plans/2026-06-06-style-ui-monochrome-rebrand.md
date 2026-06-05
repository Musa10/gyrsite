# GYR Swiss-Monochrome Rebrand — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the GYR visual system with a Swiss/precision-tech monochrome identity (Space Grotesk + Inter, light-default with dark inversion) across the public site, admin/CMS, and Arabic/RTL surface.

**Architecture:** Almost all components consume CSS-variable design tokens, so the highest-leverage change is the `globals.css` token swap — re-skinning the `ui/*` primitives and most surfaces automatically. On top of that: flip the theme-class convention (`:root` = light, `.dark` = override), swap the font pipeline, replace brand components (logo/falcon as inline SVGs from the supplied assets; delete circuit components), rewrite the hero, then a greppable utility sweep across the remaining components/pages, then admin, favicons, and final verification.

**Tech Stack:** Next.js App Router, Tailwind CSS v4 (`@theme inline` in `globals.css`), `next-themes`, `next-intl` (EN/AR, RTL), `next/font/google`, shadcn-style primitives, `sharp` (added for favicon/OG rasterization).

**Spec:** `docs/superpowers/specs/2026-06-06-style-ui-monochrome-rebrand-design.md`

**Verification convention (read once):** This codebase has no unit-test harness for UI. Every task's verification is:
1. `npx tsc --noEmit` → no errors.
2. `pnpm build` → succeeds (Turbopack compiles, no missing-asset/unknown-class failures).
3. Visual check via `pnpm dev` at the listed routes, in **EN + AR** and **light + dark**.
Commit after each task passes. Work on the current branch `build/gyrsite-v1`.

**Migration substitution table (referenced by the sweep tasks 7–10):**

| Old (remove) | New (replace with) |
|---|---|
| `text-sky`, `text-teal` | `text-foreground` (headings/eyebrows) or `text-muted-foreground` (secondary) |
| `text-gradient` | `text-foreground` (drop the class; keep plain ink) |
| `from-teal to-sky`, `bg-gradient-to-r from-teal…` | `bg-foreground` (solid) or remove |
| `font-brand` | `font-display` (Space Grotesk) |
| `font-light` (display) | `font-semibold` for display headings; body stays default |
| `tracking-[0.3em]`/`0.32em`/`0.34em`/`0.38em` (wordmark-era) | `tracking-[0.16em]` on eyebrows; `tracking-tight`/`-0.03em` on display |
| `.diamond` span | `<span className="brand-tick" />` (new square tick, defined in Task 1) |
| `bg-aura`, `.plate-hero`, `.plate-circuit`, `plate-*` | remove the element |
| `bg-grid` | keep (now a neutral hairline grid) |
| `rule-glow` | `rule` (new hairline, defined in Task 1) |
| `brand-card` | keep (now a hairline card, redefined in Task 1) |
| `[animation:glow…]`, `breathe`, `float`, `draw`, `drift`, `[animation:fade-up…]` | keep `fade-up`; remove glow/breathe/float/draw/drift |
| `[.light_&]:x` / `[.light_&]` | `[.dark_&]:x` (convention flip) |
| `<CircuitPulse/>`, `<Falcon/>` (decorative) | remove, or `<FalconMark/>` as a faint watermark (Task 4) |
| `hover:border-sky/60`, `hover:text-sky`, `*-sky/*`, `*-teal/*` | `hover:border-foreground/40`, `hover:text-foreground` |

---

## Task 1: Replace the design tokens & utility layer in `globals.css`

This is the foundation — it re-skins every token-based component and flips the theme convention.

**Files:**
- Modify (full replace): `src/app/globals.css`

- [ ] **Step 1: Replace the entire file** with the content below.

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-ink-2: hsl(var(--ink-2));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-success: hsl(var(--success));
  --color-warning: hsl(var(--warning));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-surface: hsl(var(--surface));

  --font-sans: var(--font-inter);
  --font-display: var(--font-space-grotesk);
  --font-arabic: var(--font-plex-arabic);

  --animate-fade-up: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/*
 * GYR brand theme — Swiss monochrome, LIGHT default.
 * Neutral cool-grey (zinc) ramp. Color is reserved for functional UI states only.
 */
:root {
  color-scheme: light;

  --background: 0 0% 100%;
  --foreground: 240 10% 4%;   /* ink  #0A0A0A */
  --ink-2: 240 5% 26%;        /* secondary text #3F3F46 */
  --surface: 240 5% 98%;      /* #FAFAFA */
  --card: 0 0% 100%;
  --card-foreground: 240 10% 4%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 4%;
  --primary: 240 10% 4%;      /* solid-ink buttons */
  --primary-foreground: 0 0% 100%;
  --secondary: 240 5% 96%;
  --secondary-foreground: 240 10% 4%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 46%; /* #71717A */
  --accent: 240 5% 96%;
  --accent-foreground: 240 10% 4%;
  --destructive: 0 72% 45%;
  --destructive-foreground: 0 0% 100%;
  --success: 142 71% 33%;
  --warning: 30 90% 38%;
  --border: 240 6% 90%;       /* hairline #E4E4E7 */
  --input: 240 5% 84%;        /* #D4D4D8 */
  --ring: 240 10% 4%;
}

/* Dark theme — pure inversion of the same ramp. next-themes adds class="dark". */
.dark {
  color-scheme: dark;

  --background: 240 10% 4%;   /* #0A0A0A */
  --foreground: 0 0% 98%;
  --ink-2: 240 5% 84%;        /* secondary text #D4D4D8 */
  --surface: 240 6% 9%;       /* #161618 */
  --card: 240 6% 9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 6% 9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;        /* white solid buttons */
  --primary-foreground: 240 10% 4%;
  --secondary: 240 5% 14%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 5% 14%;
  --muted-foreground: 240 5% 65%; /* #A1A1AA */
  --accent: 240 5% 14%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 72% 52%;
  --destructive-foreground: 0 0% 98%;
  --success: 142 65% 45%;
  --warning: 38 92% 50%;
  --border: 240 4% 16%;       /* #27272A */
  --input: 240 5% 26%;
  --ring: 0 0% 98%;
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-sans), system-ui, sans-serif;
  }
  ::selection {
    background-color: hsl(var(--foreground) / 0.12);
    color: hsl(var(--foreground));
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground) / 0.5) transparent;
  }
  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  *::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.45);
    border-radius: 999px;
    border: 2px solid hsl(var(--background));
  }
}

@layer components {
  /* Faint hairline Swiss grid — the only ambient texture. */
  .bg-grid {
    background-image:
      linear-gradient(hsl(var(--border) / 0.7) 1px, transparent 1px),
      linear-gradient(90deg, hsl(var(--border) / 0.7) 1px, transparent 1px);
    background-size: 64px 64px;
    background-position: center top;
  }

  /* Plain hairline rule with a faded fade at both ends. */
  .rule {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      hsl(var(--border)),
      transparent
    );
  }

  /* Hairline card — flat, lifts subtly on hover (no colored glow). */
  .brand-card {
    position: relative;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--card));
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;
  }
  .brand-card:hover {
    border-color: hsl(var(--foreground) / 0.35);
    transform: translateY(-2px);
  }

  /* Small square tick used in eyebrows (replaces the glowing diamond). */
  .brand-tick {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    margin-inline-end: 0.6rem;
    background: hsl(var(--foreground));
  }
}

/* ---------- Animations ---------- */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

/* ---------- Monochrome prose (Tiptap content) ---------- */
.prose {
  --tw-prose-body: hsl(var(--ink-2));
  --tw-prose-headings: hsl(var(--foreground));
  --tw-prose-lead: hsl(var(--muted-foreground));
  --tw-prose-links: hsl(var(--foreground));
  --tw-prose-bold: hsl(var(--foreground));
  --tw-prose-counters: hsl(var(--muted-foreground));
  --tw-prose-bullets: hsl(var(--foreground));
  --tw-prose-hr: hsl(var(--border));
  --tw-prose-quotes: hsl(var(--foreground));
  --tw-prose-quote-borders: hsl(var(--foreground));
  --tw-prose-captions: hsl(var(--muted-foreground));
  --tw-prose-code: hsl(var(--foreground));
  --tw-prose-pre-code: hsl(var(--foreground));
  --tw-prose-pre-bg: hsl(var(--surface));
  --tw-prose-th-borders: hsl(var(--border));
  --tw-prose-td-borders: hsl(var(--border));
}
.prose a {
  text-decoration-color: hsl(var(--foreground) / 0.4);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.2s ease;
}
.prose a:hover {
  text-decoration-color: hsl(var(--foreground));
}
```

- [ ] **Step 2: Verify the file compiles standalone.** Run: `npx tsc --noEmit`
Expected: PASS (CSS isn't typechecked, but this confirms nothing else broke). The build in later steps is the real CSS gate; `globals.css` alone will show unknown-utility issues only once components stop referencing `teal`/`sky`. Do not build yet — components still reference removed utilities until Tasks 3–10.

- [ ] **Step 3: Commit.**

```bash
git add src/app/globals.css
git commit -m "feat(rebrand): monochrome token system + light-default theme convention"
```

---

## Task 2: Flip the theme default and remove the accent hover

**Files:**
- Modify: `src/components/theme-provider.tsx`
- Modify: `src/components/site/theme-toggle.tsx:29`

- [ ] **Step 1: Set light as the default theme.** In `theme-provider.tsx`, change the `defaultTheme` and update the JSDoc. Replace the `<NextThemesProvider …>` props and the comment block describing `.light` so they read:

```tsx
/**
 * App-wide theme provider. `attribute="class"` makes next-themes set
 * `class="light"` / `class="dark"` on <html>; our CSS uses `:root` for the
 * light palette and `.dark` to override it (the `light` class is a no-op).
 * `defaultTheme="light"` makes light the baseline; `enableSystem` still lets a
 * first-time visitor follow a dark OS until they pick. The choice persists in
 * localStorage. `disableTransitionOnChange` prevents a color-fade flash.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Neutralize the toggle's accent hover.** In `theme-toggle.tsx`, change the button `className` (line ~29) from:

```tsx
className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-md border border-border/80 text-muted-foreground transition-colors hover:border-sky/60 hover:text-foreground"
```
to:
```tsx
className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
```

- [ ] **Step 3: Verify.** Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 4: Commit.**

```bash
git add src/components/theme-provider.tsx src/components/site/theme-toggle.tsx
git commit -m "feat(rebrand): light-default theme + neutral toggle hover"
```

---

## Task 3: Swap the font pipeline to Space Grotesk + Inter

**Files:**
- Modify: `src/app/[locale]/layout.tsx:2,9-22,83`

- [ ] **Step 1: Replace the font imports and instances.** Change line 2 and the four font constants (lines 9–22) to:

```tsx
import { Space_Grotesk, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
```
```tsx
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
```

- [ ] **Step 2: Update the `<html>` className** (line ~83) to expose only the new variables:

```tsx
className={`${spaceGrotesk.variable} ${inter.variable} ${plexArabic.variable} h-full antialiased`}
```

- [ ] **Step 3: Verify.** Run: `npx tsc --noEmit` → PASS (no references to the removed `sora`/`michroma`/`geistMono` consts remain in this file).

- [ ] **Step 4: Commit.**

```bash
git add "src/app/[locale]/layout.tsx"
git commit -m "feat(rebrand): Space Grotesk + Inter font pipeline"
```

---

## Task 4: Replace brand components — inline SVG mark/logo, delete circuit components

**Files:**
- Modify (full replace): `src/components/site/brand/falcon.tsx`
- Modify (full replace): `src/components/site/brand/logo.tsx`
- Delete: `src/components/site/brand/circuit-background.tsx`
- Delete: `src/components/site/brand/circuit-pulse.tsx`

- [ ] **Step 1: Replace `falcon.tsx`** with an inline SVG mark (path copied verbatim from `public/gyr-falcon-alone-clean.svg`), using `currentColor` so it inverts by text color:

```tsx
/**
 * GYR falcon/arrow mark — the brand symbol. Inline single-path SVG using
 * `currentColor`, so it inherits `text-foreground` and inverts for dark mode
 * with no second asset. Size with a height utility + `w-auto`. Decorative by
 * default (aria-hidden); pass a `title` to make it labelled.
 */
export function FalconMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 141 186"
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d="M22 31 L22 73 L63 112 L22 113 L22 155 L64 113 L119 113 L108 102 L96 102 Z" />
    </svg>
  );
}

/** Back-compat alias — older imports used `Falcon`. */
export const Falcon = FalconMark;
```

- [ ] **Step 2: Replace `logo.tsx`** with a monochrome lockup built from the supplied assets. The full wordmark uses the outlined SVG via `currentColor`; the icon variant uses `FalconMark`:

```tsx
import Link from "next/link";
import { FalconMark } from "./falcon";

type Variant = "horizontal" | "icon";

const SIZES = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
} as const;

/**
 * GYR logo. `horizontal` renders the full outlined "Gyr Technology" wordmark
 * (currentColor → inherits text color, inverts in dark mode). `icon` renders
 * just the falcon mark. Inlined as SVG so there are no twin light/dark PNGs.
 */
export function Logo({
  variant = "horizontal",
  size = "md",
  href = "/",
  className = "",
}: {
  variant?: Variant;
  size?: keyof typeof SIZES;
  href?: string | null;
  className?: string;
}) {
  const h = SIZES[size];

  const inner =
    variant === "icon" ? (
      <FalconMark className={`${h} w-auto text-foreground`} title="GYR" />
    ) : (
      <svg
        viewBox="0 0 790 190"
        className={`${h} w-auto text-foreground`}
        fill="currentColor"
        role="img"
        aria-label="GYR Technology"
      >
        <path d="M22 31 L22 73 L63 112 L22 113 L22 155 L64 113 L119 113 L108 102 L96 102 Z" />
        <path d="M197.900,132.867 C211.845,132.867 221.742,123.617 221.742,110.251 L221.742,103.383 L199.126,103.383 L199.126,111.835 L210.862,111.835 C210.758,118.518 205.589,123.039 198.189,123.039 C189.009,123.039 183.482,116.171 183.482,105.117 C183.482,94.029 188.974,87.126 198.039,87.126 C204.468,87.126 208.919,90.699 210.110,96.191 L221.384,96.191 C220.008,84.918 210.076,77.298 197.715,77.298 C183.193,77.298 172.278,87.912 172.278,105.117 C172.278,121.733 182.649,132.867 197.900,132.867 Z M229.147,147.101 L236.200,147.101 C242.120,147.101 245.808,144.245 248.225,137.885 L265.025,93.844 L253.971,93.844 L247.542,112.702 C246.641,115.419 245.808,118.194 244.976,120.946 C244.178,118.194 243.311,115.454 242.443,112.702 L236.049,93.844 L224.892,93.844 L239.553,131.850 L238.512,134.636 C237.495,137.562 236.523,138.683 233.991,138.683 L229.147,138.683 L229.147,147.101 Z M269.185,132.000 L279.845,132.000 L279.845,111.326 C279.845,105.591 283.060,102.550 287.430,102.550 C289.234,102.550 291.223,102.701 292.021,102.735 L292.021,93.659 C291.153,93.624 290.101,93.589 288.876,93.589 C283.857,93.589 280.967,95.763 279.556,100.342 L279.452,100.342 L279.452,93.844 L269.185,93.844 L269.185,132.000 Z" />
        <path d="M316.919,82.570 L334.911,82.570 L334.911,132.000 L339.790,132.000 L339.790,82.570 L357.712,82.570 L357.712,78.165 L316.919,78.165 L316.919,82.570 Z M379.535,132.763 C387.559,132.763 394.092,127.884 395.653,120.576 L390.993,120.576 C389.652,125.352 385.316,128.497 379.535,128.497 C371.765,128.497 366.955,122.600 366.781,114.113 L396.300,114.113 L396.300,112.668 C396.300,101.209 389.617,93.081 379.246,93.081 C369.232,93.081 362.156,101.429 362.156,112.957 C362.156,124.415 368.805,132.763 379.535,132.763 Z M366.816,110.031 C367.463,102.331 372.308,97.278 379.246,97.278 C386.218,97.278 391.132,102.365 391.641,110.031 L366.816,110.031 Z M418.594,132.763 C426.942,132.763 433.186,127.190 434.423,119.570 L429.613,119.570 C428.353,124.993 424.699,128.497 418.594,128.497 C410.824,128.497 405.910,122.276 405.910,112.957 C405.910,103.637 410.859,97.347 418.594,97.347 C424.630,97.347 428.607,101.001 429.683,106.273 L434.423,106.273 C433.186,98.538 426.977,93.081 418.594,93.081 C408.257,93.081 401.216,101.359 401.216,112.957 C401.216,124.519 408.257,132.763 418.594,132.763 Z M446.016,108.840 C446.016,101.325 450.896,97.498 457.116,97.498 C463.360,97.498 467.268,101.359 467.268,108.193 L467.268,132.000 L471.928,132.000 L471.928,107.904 C471.928,98.399 465.788,93.162 457.868,93.162 C452.850,93.162 448.618,95.289 446.016,99.764 L446.016,78.165 L441.391,78.165 L441.391,132.000 L446.016,132.000 L446.016,108.840 Z M485.871,108.840 C485.871,101.325 490.750,97.498 496.971,97.498 C503.214,97.498 507.123,101.359 507.123,108.193 L507.123,132.000 L511.782,132.000 L511.782,107.904 C511.782,98.399 505.642,93.162 497.722,93.162 C492.669,93.162 488.368,95.324 485.801,99.949 L485.801,93.844 L481.246,93.844 L481.246,132.000 L485.871,132.000 L485.871,108.840 Z M536.351,132.763 C546.688,132.763 553.729,124.519 553.729,112.957 C553.729,101.359 546.688,93.081 536.351,93.081 C526.014,93.081 518.973,101.359 518.973,112.957 C518.973,124.519 526.014,132.763 536.351,132.763 Z M536.351,128.497 C528.581,128.497 523.667,122.276 523.667,112.957 C523.667,103.637 528.616,97.347 536.351,97.347 C544.086,97.347 549.035,103.637 549.035,112.957 C549.035,122.241 544.121,128.497 536.351,128.497 Z M565.543,78.165 L560.918,78.165 L560.918,132.000 L565.543,132.000 L565.543,78.165 Z M590.117,132.763 C600.454,132.763 607.495,124.519 607.495,112.957 C607.495,101.359 600.454,93.081 590.117,93.081 C579.780,93.081 572.738,101.359 572.738,112.957 C572.738,124.519 579.780,132.763 590.117,132.763 Z M590.117,128.497 C582.347,128.497 577.433,122.276 577.433,112.957 C577.433,103.637 582.381,97.347 590.117,97.347 C597.852,97.347 602.801,103.637 602.801,112.957 C602.801,122.241 597.887,128.497 590.117,128.497 Z M630.189,147.540 C639.543,147.540 646.735,142.626 646.735,132.000 L646.735,93.844 L642.180,93.844 L642.180,101.255 L642.145,101.255 C639.902,96.087 634.884,93.162 629.172,93.162 C619.378,93.162 612.557,101.105 612.557,112.922 C612.557,124.739 619.344,132.682 629.172,132.682 C634.953,132.682 639.694,129.757 642.110,124.773 L642.145,124.773 L642.145,132.000 C642.145,139.123 637.740,143.377 630.189,143.377 C624.258,143.377 620.327,140.741 619.205,136.047 L614.430,136.047 C615.517,143.308 621.448,147.540 630.189,147.540 Z M629.785,128.427 C622.523,128.427 617.251,122.854 617.251,112.922 C617.251,102.990 622.523,97.382 629.785,97.382 C637.451,97.382 642.434,103.487 642.434,112.922 C642.434,122.357 637.451,128.427 629.785,128.427 Z M656.021,147.101 L659.560,147.101 C664.335,147.101 667.364,144.684 669.538,139.261 L687.529,93.844 L682.581,93.844 L673.620,117.154 C672.429,120.218 671.238,123.328 670.116,126.404 C668.995,123.328 667.838,120.218 666.647,117.154 L657.571,93.844 L652.553,93.844 L667.734,131.896 L665.376,137.747 C663.826,141.643 662.416,142.950 659.560,142.950 L656.021,142.950 L656.021,147.101 Z" />
      </svg>
    );

  if (href === null) {
    return <span className={className}>{inner}</span>;
  }
  return (
    <Link
      href={href}
      aria-label="GYR — home"
      className={`inline-flex items-center transition-opacity hover:opacity-80 ${className}`}
    >
      {inner}
    </Link>
  );
}
```

- [ ] **Step 3: Delete the circuit components.**

```bash
git rm src/components/site/brand/circuit-background.tsx src/components/site/brand/circuit-pulse.tsx
```

- [ ] **Step 4: Find every importer of the deleted/renamed pieces** so Tasks 5–8 fix them. Run:

```bash
grep -rn "CircuitPulse\|circuit-pulse\|CircuitBackground\|circuit-background\|/falcon.png\|from \"./falcon\"\|brand/falcon\|<Falcon" src/
```
Expected: matches in `hero.tsx` (Task 6) and possibly `logo.tsx` (now fixed) and the `(site)/layout.tsx` (Task 8). Note them; they're handled in their tasks. `tsc`/`build` will fail until those are done — that's expected.

- [ ] **Step 5: Verify the brand files typecheck in isolation.** Run: `npx tsc --noEmit`
Expected: errors ONLY in files that still import `CircuitPulse`/`Falcon` decoratively (hero, etc.). The brand files themselves must contribute no errors. If `Logo`'s old props (`priority`, `stacked`, `size: "md"`) are used by a caller with removed options, note them for Task 5/8.

- [ ] **Step 6: Commit.**

```bash
git add src/components/site/brand/falcon.tsx src/components/site/brand/logo.tsx
git commit -m "feat(rebrand): inline SVG falcon mark + monochrome logo; remove circuit components"
```

---

## Task 5: Rebuild the site header

**Files:**
- Modify (full replace): `src/components/site/site-header.tsx`

- [ ] **Step 1: Replace the file.** Removes the `plate-circuit` texture, the twin PNG logos, the teal→sky underline, and the `[.light_&]` branch; uses the inline `Logo`.

```tsx
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getNavPages } from "@/server/public-content";
import { Logo } from "@/components/site/brand/logo";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const navPages = await getNavPages(locale);
  const isAr = locale === "ar";

  const links = [
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("insights") },
    { href: "/#contact", label: t("contact") },
    ...navPages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  // Latin nav uses tracked uppercase labels (Swiss eyebrow style); Arabic keeps
  // natural case with no tracking (tracking breaks Arabic letter-joining).
  const linkType = isAr
    ? "font-arabic text-[0.95rem]"
    : "text-[0.72rem] uppercase tracking-[0.16em]";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo href="/" size="md" />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative py-2 text-muted-foreground transition-colors hover:text-foreground ${linkType}`}
            >
              {l.label}
              <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify.** Run: `npx tsc --noEmit`
Expected: no new errors from this file. (Hero may still error until Task 6.)

- [ ] **Step 3: Commit.**

```bash
git add src/components/site/site-header.tsx
git commit -m "feat(rebrand): monochrome site header with inline logo"
```

---

## Task 6: Rewrite the hero

**Files:**
- Modify (full replace): `src/components/site/hero.tsx`

- [ ] **Step 1: Replace the file.** Keeps the same props/API (`eyebrow`, `title`, `sub`, `actions`, `variant`) so callers don't change. Replaces plate/circuit/glow/falcon with a hairline grid + a faint falcon watermark in the visual cell.

```tsx
import type { ReactNode } from "react";
import { FalconMark } from "@/components/site/brand/falcon";

/**
 * Above-the-fold hero — Swiss monochrome.
 *
 * `variant="full"` (Home) shows the faint hairline grid behind the content and a
 * large, low-opacity falcon mark in the visual cell. `variant="lite"` (interior
 * pages) drops the grid for a quieter band. The visual cell flips sides on RTL
 * via the grid order, so the mark never sits under the text.
 *
 * Content (title/sub/actions) is passed in, so callers own localization.
 */
export function Hero({
  eyebrow,
  title,
  sub,
  actions,
  variant = "full",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  actions?: ReactNode;
  variant?: "full" | "lite";
}) {
  const isFull = variant === "full";

  return (
    <section className="relative overflow-hidden border-b border-border">
      {isFull && (
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
      )}

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        <div className="space-y-7">
          <p className="inline-flex items-center text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground [animation:fade-up_0.7s_both]">
            <span className="brand-tick" />
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl [animation:fade-up_0.7s_0.1s_both]">
            {title}
          </h1>
          {sub && (
            <p className="max-w-md text-base leading-relaxed text-muted-foreground [animation:fade-up_0.7s_0.3s_both]">
              {sub}
            </p>
          )}
          {actions && (
            <div className="flex flex-wrap items-center gap-4 [animation:fade-up_0.7s_0.4s_both]">
              {actions}
            </div>
          )}
        </div>

        <div className="relative flex min-h-[18rem] items-center justify-center [animation:fade-up_0.9s_0.2s_both]">
          <FalconMark className="h-64 w-auto text-foreground/[0.06] sm:h-80" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify hero + its callers typecheck.** Run: `npx tsc --noEmit`
Expected: this file contributes no errors. Pages that wrapped `title` in a `text-gradient` span still render (the class just no longer exists) — they are cleaned in Task 8, but they do not error.

- [ ] **Step 3: Commit.**

```bash
git add src/components/site/hero.tsx
git commit -m "feat(rebrand): monochrome hero (hairline grid + faint falcon mark)"
```

---

## Task 7: Sweep the remaining site components

Apply the **migration substitution table** (top of plan) to each file. For each: read it, replace every old utility with its new equivalent, remove decorative glow/aura/plate elements, and switch any `[.light_&]` to `[.dark_&]`.

**Files (read + edit each):**
- `src/components/site/section-heading.tsx`
- `src/components/site/page-header.tsx`
- `src/components/site/site-footer.tsx`
- `src/components/site/contact-cta.tsx`
- `src/components/site/trust-strip.tsx`
- `src/components/site/prose.tsx`
- `src/components/site/locale-switcher.tsx`

- [ ] **Step 1: List exactly what to change.** Run:

```bash
grep -rn "teal\|sky\|brand-\|text-gradient\|bg-aura\|bg-grid\|plate-\|font-brand\|font-light\|diamond\|rule-glow\|\[\.light_\|animate-\(glow\|float\|draw\|drift\)\|breathe" src/components/site/section-heading.tsx src/components/site/page-header.tsx src/components/site/site-footer.tsx src/components/site/contact-cta.tsx src/components/site/trust-strip.tsx src/components/site/prose.tsx src/components/site/locale-switcher.tsx
```

- [ ] **Step 2: Edit each file** per the table. Specific known cases:
  - **Eyebrows/kickers:** `font-brand … text-sky` → `text-muted-foreground` (keep `uppercase tracking-[0.16em]`), and any leading `.diamond` span → `<span className="brand-tick" />`.
  - **Display headings:** `font-brand`/`font-light` → `font-display font-semibold`, accent gradient titles → `text-foreground`.
  - **Footer/locale-switcher hovers:** `hover:text-sky`/`hover:border-sky/*` → `hover:text-foreground`/`hover:border-foreground/40`.
  - **Section rules:** `rule-glow` → `rule`.
  - **Any `bg-aura`/`plate-*` decorative div:** delete the element.

- [ ] **Step 3: Verify.** Run: `npx tsc --noEmit` → PASS. Then `grep` from Step 1 again across the same files → **zero** matches for `teal|sky|font-brand|text-gradient|diamond|rule-glow|bg-aura|plate-|[.light_` (a remaining `bg-grid` match is fine).

- [ ] **Step 4: Commit.**

```bash
git add src/components/site
git commit -m "feat(rebrand): sweep site components to monochrome tokens"
```

---

## Task 8: Sweep the site pages & site layout

**Files (read + edit each):**
- `src/app/[locale]/(site)/layout.tsx`
- `src/app/[locale]/(site)/page.tsx`
- `src/app/[locale]/(site)/about/page.tsx`
- `src/app/[locale]/(site)/blog/page.tsx`
- `src/app/[locale]/(site)/blog/[slug]/page.tsx`
- `src/app/[locale]/(site)/team/page.tsx`
- `src/app/[locale]/(site)/[...slug]/page.tsx`

- [ ] **Step 1: List what to change.** Run:

```bash
grep -rn "teal\|sky\|brand-\|text-gradient\|bg-aura\|bg-grid\|plate-\|font-brand\|font-light\|diamond\|rule-glow\|CircuitPulse\|CircuitBackground\|<Falcon\|\[\.light_" "src/app/[locale]/(site)"
```

- [ ] **Step 2: Edit each file** per the substitution table. Key cases:
  - `(site)/layout.tsx`: remove any page-level `bg-aura`/`bg-grid`/`CircuitBackground` wrapper element (the hero now owns its own grid). Keep the `SiteHeader`/`SiteFooter` structure.
  - Page hero titles passing a `<span className="text-gradient">…</span>` → drop the wrapper or change to `<span className="text-foreground">…</span>`.
  - Hero `variant="lite"`/`"full"` props are unchanged (Task 6 kept the API).
  - Any remaining `<Falcon …>` decorative usage → `<FalconMark className="… text-foreground/[0.06]" />` or remove.
  - Card grids using `brand-card` keep the class (redefined in Task 1); remove colored hover utilities.

- [ ] **Step 3: Verify.** Run: `npx tsc --noEmit` → PASS, then `pnpm build` → **succeeds** (this is the first full build; it confirms no removed utility/asset breaks compilation). Re-run the Step 1 grep → only `bg-grid` may remain.

- [ ] **Step 4: Visual check.** `pnpm dev`, then load `/en`, `/en/about`, `/en/blog`, `/en/team`, `/ar`, in light and dark. Confirm: no teal/circuit, Space Grotesk headings, working toggle, RTL mirrored.

- [ ] **Step 5: Commit.**

```bash
git add "src/app/[locale]/(site)"
git commit -m "feat(rebrand): sweep site pages & layout to monochrome"
```

---

## Task 9: Regenerate favicons & OG image (monochrome)

**Files:**
- Create: `public/icon.svg` (adaptive SVG favicon)
- Create: `scripts/make-brand-assets.mjs`
- Modify: `src/app/[locale]/layout.tsx` (icons metadata)
- Generated: `public/favicon-32.png`, `public/favicon-48.png`, `public/apple-touch-icon.png`, `public/og.png`

- [ ] **Step 1: Add `sharp` as a dev dependency.** Run: `pnpm add -D sharp`

- [ ] **Step 2: Create `public/icon.svg`** — an SVG favicon that adapts to the browser theme (black mark on light chrome, white on dark):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141 186">
  <style>
    path { fill: #0a0a0a; }
    @media (prefers-color-scheme: dark) { path { fill: #fafafa; } }
  </style>
  <path d="M22 31 L22 73 L63 112 L22 113 L22 155 L64 113 L119 113 L108 102 L96 102 Z"/>
</svg>
```

- [ ] **Step 3: Create `scripts/make-brand-assets.mjs`** to rasterize PNG fallbacks + OG from the supplied black-fill SVGs (no font dependency — the wordmark SVG is already outlined):

```js
import sharp from "sharp";
import { readFileSync } from "node:fs";

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const MARK = readFileSync("public/gyr-falcon-alone-clean.svg");
const WORDMARK = readFileSync("public/gyr-technology-logo-clean-outlined.svg").toString();

// Square PNG favicon/apple-icon: black mark centered on white with padding.
async function markSquare(size, pad, out) {
  const mark = await sharp(MARK)
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: WHITE })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(out);
}

await markSquare(32, 5, "public/favicon-32.png");
await markSquare(48, 7, "public/favicon-48.png");
await markSquare(180, 28, "public/apple-touch-icon.png");

// OG image: 1200x630 white, outlined wordmark centered, hairline rule beneath.
const wordmark = await sharp(Buffer.from(WORDMARK.replace(/#000000/g, "#0a0a0a")))
  .resize(620, null, { fit: "contain" })
  .png()
  .toBuffer();

await sharp({ create: { width: 1200, height: 630, channels: 4, background: WHITE } })
  .composite([
    { input: wordmark, gravity: "centre" },
    {
      input: Buffer.from(
        `<svg width="1200" height="630"><rect x="290" y="430" width="620" height="2" fill="#e4e4e7"/></svg>`
      ),
      top: 0,
      left: 0,
    },
  ])
  .png()
  .toFile("public/og.png");

console.log("brand assets written");
```

> Runs as ESM (`.mjs`) on Node ≥ 14.8 (top-level `await`). The script is self-contained and reproducible from the two supplied SVGs.

- [ ] **Step 4: Run it.** Run: `node scripts/make-brand-assets.mjs`
Expected: prints `brand assets written`; the four PNGs appear in `public/`.

- [ ] **Step 5: Wire the SVG favicon into metadata.** In `src/app/[locale]/layout.tsx`, update the `icons` block to prefer the adaptive SVG:

```tsx
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
```

- [ ] **Step 6: Verify.** Run: `npx tsc --noEmit` → PASS; `pnpm build` → succeeds. Visually confirm the favicon + `og.png` look correct.

- [ ] **Step 7: Commit.**

```bash
git add public/icon.svg public/favicon-32.png public/favicon-48.png public/apple-touch-icon.png public/og.png scripts/make-brand-assets.mjs package.json pnpm-lock.yaml "src/app/[locale]/layout.tsx"
git commit -m "feat(rebrand): monochrome favicons + OG image"
```

---

## Task 10: Restyle the admin / CMS

The `ui/*` primitives are token-based and already re-skinned by Task 1, so admin mostly inherits. This task catches admin-specific chrome and any brand utilities.

**Files (read + edit as needed):**
- `src/app/[locale]/admin/layout.tsx`
- `src/components/admin/sidebar.tsx`
- `src/app/[locale]/admin/login/page.tsx` + `login/login-form.tsx`
- `src/components/admin/*.tsx` (forms, buttons, media, delete/logout)
- Spot-check `src/components/ui/{card,input,badge,table,textarea}.tsx`

- [ ] **Step 1: Find admin-specific brand usages.** Run:

```bash
grep -rn "teal\|sky\|brand-\|text-gradient\|bg-aura\|font-brand\|font-light\|diamond\|rule-glow\|\[\.light_\|Falcon\|Circuit" "src/app/[locale]/admin" src/components/admin
```

- [ ] **Step 2: Apply the substitution table** to any matches. Replace any header logo (twin PNG / `[.light_&]`) with `<Logo variant="horizontal" size="sm" />`. Ensure the login page and sidebar use `bg-background`/`bg-surface`, `text-foreground`/`text-muted-foreground`, and hairline `border-border` — no accent colors.

- [ ] **Step 3: Spot-check `ui/*` primitives.** Open each listed `ui/*` file; confirm it references only token classes (`bg-primary`, `border-input`, `text-muted-foreground`, etc.) and contains no hard-coded `teal/sky`. Fix any literal accent if present. (Per the earlier audit, `button.tsx` is clean.)

- [ ] **Step 4: Verify.** Run: `npx tsc --noEmit` → PASS; `pnpm build` → succeeds.

- [ ] **Step 5: Visual check.** `pnpm dev`; log in at `/en/admin/login`; open dashboard, posts list, a post editor, media, team — in light + dark. Confirm monochrome, readable forms, working primitives.

- [ ] **Step 6: Commit.**

```bash
git add "src/app/[locale]/admin" src/components/admin src/components/ui
git commit -m "feat(rebrand): monochrome admin/CMS"
```

---

## Task 11: Final sweep, RTL parity, asset cleanup & full verification

**Files:**
- Delete stale assets in `public/` (if present)
- Possibly modify `src/components/site/section-heading.tsx` etc. for any residue

- [ ] **Step 1: Global residue grep.** Run:

```bash
grep -rn "teal\|brand-teal\|brand-sky\|text-gradient\|bg-aura\|plate-\|font-brand\|font-michroma\|Sora\|Michroma\|Geist_Mono\|diamond\|rule-glow\|CircuitPulse\|CircuitBackground\|/falcon.png\|logo-horizontal\|\[\.light_" src/
```
Expected: **zero** matches. Fix any stragglers, re-run until clean. (A lone `bg-grid` or `bg-sky-*` from an unrelated utility, if any, is acceptable only if intentional — otherwise replace.)

- [ ] **Step 2: Remove stale public assets** that the rebrand orphaned. Run (ignore "did not match" for any already-absent file):

```bash
git rm --ignore-unmatch public/logo-horizontal.png public/logo-horizontal-light.png public/backgrounddark.png public/backgroundlight.png public/circuitsdark.png public/circuitslight.png public/falcon.png
```
Keep `public/logo.png` (raster fallback), the two supplied SVGs, and the generated favicons/OG (`icon.svg`, `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png`, `og.png`).

- [ ] **Step 3: Full typecheck + build.** Run: `npx tsc --noEmit` → PASS; then `pnpm build` → **succeeds** with no warnings about missing images or unknown utilities.

- [ ] **Step 4: Full manual matrix.** `pnpm dev`. For each of {`/en`, `/ar`} × {light, dark}, verify on home, an interior page, blog, team, and `/admin`:
  - Fonts: Space Grotesk on display headings, Inter on body, Plex Arabic on Arabic.
  - Color: pure monochrome; no teal/sky/circuit anywhere; functional colors only on form states.
  - Theme: toggle flips cleanly; light is the default on a fresh load (clear localStorage to confirm).
  - RTL: layout mirrored, logo/nav/hero correct, no clipped text.
  - Logo/favicon: inline SVG crisp in both themes; browser-tab icon adapts.
  - Motion: only `fade-up`; `prefers-reduced-motion` disables it.

- [ ] **Step 5: Update the brand memory.** The site identity changed materially; update the project memory note `gyr-visual-identity.md` to describe the new monochrome system (so future sessions don't reference the retired teal/circuit identity).

- [ ] **Step 6: Final commit.**

```bash
git add -A
git commit -m "chore(rebrand): remove stale brand assets; final monochrome verification"
```

---

## Self-review notes (for the implementer)

- **Theme flip is load-bearing.** If any `[.light_&]` selector survives, that element's light/dark styling inverts. The Task 11 grep is the backstop — it must return zero.
- **Build is the CSS gate.** `tsc` won't catch removed Tailwind utilities or missing images; `pnpm build` will. Tasks 8–11 each build.
- **Caller API preserved.** Tasks 4–6 kept `Logo` and `Hero` prop shapes compatible (with a `Falcon` alias) so the page sweep (Task 8) is mostly class-level, not structural.
- **Assets are deterministic.** Favicons/OG derive from the supplied outlined SVGs (no font rendering), so `make-brand-assets.mjs` is reproducible.
