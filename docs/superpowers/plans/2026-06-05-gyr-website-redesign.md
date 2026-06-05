# GYR Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public GYR site (Home, About, Insights) in a bank-grade "Quiet Institutional" system with a reusable brand component library that keeps CMS-rendered pages on-brand.

**Architecture:** Refine the existing Tailwind v4 token system in `globals.css` (don't rewrite it). Add a small set of focused brand components (`Hero`, `CircuitPulse`, `CircuitBackground`, `CircuitDivider`, `SectionHeading`, `TrustStrip`, branded `PageHeader`/`Prose`). Home and About are coded routes (Next.js explicit routes win over the `[...slug]` catch-all, which already 404s `customLayout` pages); Insights stays CMS-driven and gets restyled. About reads an optional CMS `Page` (slug `about`) for an editable middle region.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind CSS v4, Prisma 7 (Postgres), `sharp` for asset processing, `tsx` for scripts, pnpm.

**Verification model (no test runner is configured; this is visual work):** Each task verifies with — (a) `pnpm exec tsc --noEmit` (typecheck), (b) `pnpm lint`, and (c) a visual check in `pnpm dev` at http://localhost:3000. Do **not** add a test framework. Commit after each task.

**Out of scope:** bilingual/i18n (in-progress separately), CMS schema changes (none needed), Team/Capabilities/Careers pages, e-commerce, auth.

---

## File Structure

**Create:**
- `scripts/make-falcon.mjs` — one-off sharp script: extract transparent falcon emblem from the dark vertical lockup → `public/falcon.png`.
- `src/components/site/brand/circuit-pulse.tsx` — animated SVG overlay (pulses, blinking nodes, breathing glow); reduced-motion aware.
- `src/components/site/brand/circuit-background.tsx` — static circuit-texture plate wrapper.
- `src/components/site/section-heading.tsx` — eyebrow + title + optional intro.
- `src/components/site/trust-strip.tsx` — "trusted in production by" logo row.
- `src/components/site/hero.tsx` — full above-the-fold hero (slots) used by Home; lite variant by About.
- `src/components/site/contact-cta.tsx` — closing CTA band + simple contact form.
- `src/app/(site)/about/page.tsx` — coded About route.

**Modify:**
- `src/app/globals.css` — palette tuning + `CircuitDivider`/`.rule-glow` refine + animations for pulse/blink/breathe.
- `src/app/(site)/layout.tsx` — calm the ambient atmosphere (reduce aura), keep grid.
- `src/app/layout.tsx` — remove UAE copy from metadata; fix OG image reference.
- `src/components/site/brand/falcon.tsx` — point at `/falcon.png` (new transparent asset).
- `src/components/site/page-header.tsx` — bank-grade restyle, remove UAE assumptions.
- `src/components/site/prose.tsx` — verify/extend bank-grade prose theme (most lives in globals.css `.prose`).
- `src/components/site/site-header.tsx` — nav: Home (logo) · About · Insights · Contact; drop Team; horizontal lockup.
- `src/components/site/site-footer.tsx` — remove UAE + Team; add contact; restate principles.
- `src/app/(site)/page.tsx` — Home rebuilt from brand components.
- `src/app/(site)/blog/page.tsx` — Insights list restyle (mostly inherits components).
- `src/app/(site)/blog/[slug]/page.tsx` — article restyle (circuit divider, falcon mark).
- `src/lib/slugify.ts` — add `about` to `RESERVED_SLUGS`.

**Delete (later, optional):** `src/app/(site)/team/page.tsx` + `/team` reserved slug — only if user confirms removing Team entirely (Open Item #5; default: leave dormant, just unlink from nav/footer).

---

## Phase 0 — Foundations & Unbreak

### Task 1: Transparent falcon asset + fix broken `Falcon`

**Problem:** `Falcon` references `/brand/falcon.png`, which was deleted with `public/brand/*`. The site currently 404s the mark everywhere.

**Files:**
- Create: `scripts/make-falcon.mjs`
- Modify: `src/components/site/brand/falcon.tsx`

- [ ] **Step 1: Write the extraction script**

`scripts/make-falcon.mjs`:
```js
// Extract a transparent falcon emblem from the dark vertical lockup.
// The lockup is the teal/cyan falcon on near-black navy, wordmark beneath.
// We crop the top emblem band and luminance-key the dark background to alpha.
import sharp from "sharp";

const SRC = "public/logowithnamedark.png";
const OUT = "public/falcon.png";

// Luminance thresholds (0-255). Pixels darker than LO -> fully transparent;
// brighter than HI -> fully opaque; between -> feathered. Tune after preview.
const LO = 34;
const HI = 64;

const base = sharp(SRC).ensureAlpha();
const meta = await base.metadata();

// Emblem occupies roughly the top 62% of the vertical lockup.
const cropH = Math.round(meta.height * 0.62);
const { data, info } = await base
  .extract({ left: 0, top: 0, width: meta.width, height: cropH })
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = info.channels; // 4
for (let i = 0; i < data.length; i += px) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let a;
  if (lum <= LO) a = 0;
  else if (lum >= HI) a = 255;
  else a = Math.round(((lum - LO) / (HI - LO)) * 255);
  data[i + 3] = a;
}

await sharp(data, { raw: info })
  .png()
  .trim({ threshold: 0 }) // drop fully-transparent margins
  .toFile(OUT);

const out = await sharp(OUT).metadata();
console.log(`wrote ${OUT} ${out.width}x${out.height}`);
```

- [ ] **Step 2: Run it**

Run: `pnpm exec node scripts/make-falcon.mjs`
Expected: prints `wrote public/falcon.png <W>x<H>`. **Open `public/falcon.png`** and confirm: teal falcon, transparent background, no hard navy box, minimal halo. If there's a dark halo, raise `LO`; if edges are eaten, lower `HI`. Re-run until clean.

- [ ] **Step 3: Point `Falcon` at the new asset**

Replace `src/components/site/brand/falcon.tsx` body image. Use the dimensions printed in Step 2 (call them `W`/`H`):
```tsx
import Image from "next/image";

/** GYR falcon emblem — transparent teal mark for the dark UI. */
export function Falcon({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/falcon.png"
      alt=""
      aria-hidden
      width={W}
      height={H}
      priority={priority}
      className={className}
    />
  );
}
```

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit` → no errors.
Run `pnpm dev`, open `/` → the falcon renders (no broken image) and floats with no box.

- [ ] **Step 5: Commit**

```bash
git add scripts/make-falcon.mjs public/falcon.png src/components/site/brand/falcon.tsx
git commit -m "fix(brand): transparent falcon asset, repair broken Falcon path"
```

---

### Task 2: Palette & atmosphere tuning (bank-grade)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/(site)/layout.tsx`

- [ ] **Step 1: Deepen background, platinum headings, calmer aura**

In `globals.css` `:root`, change these tokens:
```css
  --background: 210 45% 4%;      /* was 215 36% 6% — deeper near-black navy */
  --foreground: 210 30% 97%;     /* platinum */
  --card: 210 34% 7%;            /* was 215 30% 9% */
  --muted-foreground: 210 14% 62%;
```
In the `.bg-aura` component block, lower the glow opacities:
```css
  .bg-aura {
    background:
      radial-gradient(60% 60% at 80% 15%, hsl(var(--brand-teal) / 0.12), transparent 70%),
      radial-gradient(50% 50% at 10% 90%, hsl(var(--brand-sky) / 0.06), transparent 70%);
  }
```

- [ ] **Step 2: Add pulse/blink/breathe keyframes**

Append to the animations section of `globals.css`:
```css
@keyframes pulse-trace { from { stroke-dashoffset: var(--trace-len, 600); } to { stroke-dashoffset: 0; } }
@keyframes node-blink { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
@keyframes breathe { 0%, 100% { opacity: 0.5; transform: scale(0.96); } 50% { opacity: 1; transform: scale(1.06); } }
```

- [ ] **Step 3: Calm the global atmosphere layer**

In `src/app/(site)/layout.tsx`, reduce the grid intensity by adding `opacity-60` to the `bg-grid` div and keep `bg-aura` (now already calmer):
```tsx
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-60 [animation:drift_30s_linear_infinite]"
      />
```

- [ ] **Step 4: Verify**

Run `pnpm dev`, open `/` → background reads deeper/calmer; headings near-white; ambient glow is subtle, not neon.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css "src/app/(site)/layout.tsx"
git commit -m "style(theme): bank-grade palette + calmer atmosphere + pulse keyframes"
```

---

### Task 3: Remove UAE positioning from metadata

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite metadata copy and OG image**

In `src/app/layout.tsx` `metadata`, replace UAE strings and the deleted banner ref:
```tsx
  title: {
    default: "GYR — Intelligent software banks run on.",
    template: "%s · GYR",
  },
  description:
    "GYR builds AI-driven software products for banks and financial institutions — engineered for regulated, mission-critical operations.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "GYR — Intelligent software banks run on.",
    description: "AI software for financial institutions.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
```
(`/og.png` is generated in Task 16. Favicons already exist in `public/`.)

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit` → no errors. (OG image 404 until Task 16 — acceptable.)

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "content: drop UAE positioning from site metadata"
```

---

## Phase 1 — Brand Component Library

### Task 4: `CircuitPulse` animated overlay

**Files:**
- Create: `src/components/site/brand/circuit-pulse.tsx`

- [ ] **Step 1: Write the component**

`src/components/site/brand/circuit-pulse.tsx`:
```tsx
/**
 * Ambient circuit overlay that extends the falcon wing's language out into the
 * page: teal->cyan traces fanning up-and-right from an origin near the emblem,
 * with a traveling pulse, blinking nodes, and a breathing glow.
 *
 * Pure SVG/CSS; pointer-events:none; honors prefers-reduced-motion via the
 * global media query in globals.css (it neutralizes animation-duration).
 */
export function CircuitPulse({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
    >
      <defs>
        <linearGradient id="gyr-wing" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--brand-teal))" />
          <stop offset="55%" stopColor="hsl(var(--brand-teal))" />
          <stop offset="100%" stopColor="hsl(var(--brand-sky))" />
        </linearGradient>
      </defs>

      {/* static traces (matched to wing direction) */}
      <g stroke="url(#gyr-wing)" strokeWidth="1.1" opacity="0.5">
        <path d="M640 300 L740 240 L860 240" />
        <path d="M640 300 L760 300 L880 250" />
        <path d="M640 300 L720 200 L840 150" />
        <path d="M640 300 L700 150 L760 70" />
        <path d="M640 300 L560 240 L420 240" />
        <path d="M640 300 L540 300 L380 320" />
        <path d="M640 300 L580 360 L460 420" />
      </g>

      {/* blinking nodes — brighter toward tips */}
      <g>
        {[
          [740, 240], [860, 240], [880, 250], [840, 150],
          [760, 70], [420, 240], [380, 320], [460, 420],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={2.8}
            fill="hsl(var(--brand-sky))"
            style={{ animation: `node-blink ${2.4 + (i % 4) * 0.4}s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </g>

      {/* traveling pulse along a tip-ward trace */}
      <path
        d="M640 300 L720 200 L840 150"
        stroke="hsl(var(--brand-sky))"
        strokeWidth="1.8"
        strokeDasharray="34 360"
        style={{ ["--trace-len" as string]: "400", animation: "pulse-trace 3.2s linear infinite" }}
        opacity="0.9"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit` → no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/brand/circuit-pulse.tsx
git commit -m "feat(brand): CircuitPulse animated overlay"
```

---

### Task 5: `CircuitBackground` + `CircuitDivider`

**Files:**
- Create: `src/components/site/brand/circuit-background.tsx`
- Modify: `src/app/globals.css` (no change if `.rule-glow` reused; add `CircuitDivider` as a thin wrapper component instead)

- [ ] **Step 1: Write `CircuitBackground`**

`src/components/site/brand/circuit-background.tsx`:
```tsx
import Image from "next/image";

/** Static circuit-texture plate, darkened so text stays readable on top. */
export function CircuitBackground({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <Image src="/circuitsdark.png" alt="" fill sizes="100vw" className="object-cover opacity-[0.10]" />
      <div className="absolute inset-0 bg-background/40" />
    </div>
  );
}

/** Hairline brand divider with a node accent (reuses .rule-glow). */
export function CircuitDivider({ className = "" }: { className?: string }) {
  return <div className={`rule-glow ${className}`} />;
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit` → no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/brand/circuit-background.tsx
git commit -m "feat(brand): CircuitBackground + CircuitDivider"
```

---

### Task 6: `SectionHeading`

**Files:**
- Create: `src/components/site/section-heading.tsx`

- [ ] **Step 1: Write it**

`src/components/site/section-heading.tsx`:
```tsx
/** Consistent section opener: Michroma eyebrow + title + optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="font-brand mb-3 flex items-center gap-3 text-[0.7rem] tracking-[0.3em] text-sky">
        <span className="diamond" />
        {eyebrow}
      </p>
      <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Verify + Commit**

Run: `pnpm exec tsc --noEmit` → no errors.
```bash
git add src/components/site/section-heading.tsx
git commit -m "feat(brand): SectionHeading"
```

---

### Task 7: `TrustStrip`

**Files:**
- Create: `src/components/site/trust-strip.tsx`

- [ ] **Step 1: Write it (accepts logos, falls back to confidential placeholders)**

`src/components/site/trust-strip.tsx`:
```tsx
import Image from "next/image";

type Logo = { src: string; alt: string };

/**
 * "Trusted in production by" row — the strongest credibility signal for bank
 * buyers. Pass real client logos; with none, renders confidential placeholders.
 */
export function TrustStrip({
  label = "TRUSTED IN PRODUCTION BY",
  logos = [],
  placeholderCount = 4,
}: {
  label?: string;
  logos?: Logo[];
  placeholderCount?: number;
}) {
  return (
    <div className="border-y border-border/60 bg-background/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-4 px-4 py-6 sm:px-6">
        <span className="font-brand text-[0.62rem] tracking-[0.3em] text-muted-foreground/70">
          {label}
        </span>
        <div className="flex flex-wrap items-center gap-8 opacity-70">
          {logos.length > 0
            ? logos.map((l) => (
                <Image key={l.src} src={l.src} alt={l.alt} width={96} height={24} className="h-5 w-auto opacity-80" />
              ))
            : Array.from({ length: placeholderCount }).map((_, i) => (
                <span
                  key={i}
                  className="font-brand rounded border border-border/60 px-3 py-1 text-[0.6rem] tracking-[0.25em] text-muted-foreground/60"
                >
                  CONFIDENTIAL
                </span>
              ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify + Commit**

Run: `pnpm exec tsc --noEmit` → no errors.
```bash
git add src/components/site/trust-strip.tsx
git commit -m "feat(brand): TrustStrip"
```

---

### Task 8: `Hero`

**Files:**
- Create: `src/components/site/hero.tsx`

- [ ] **Step 1: Write the hero (full + lite variants)**

`src/components/site/hero.tsx`:
```tsx
import Image from "next/image";
import { Falcon } from "@/components/site/brand/falcon";
import { CircuitPulse } from "@/components/site/brand/circuit-pulse";

/**
 * Above-the-fold hero. `variant="full"` (Home) uses the background plate +
 * emblem + circuit pulse. `variant="lite"` (About) drops the plate for calm.
 */
export function Hero({
  eyebrow,
  title,
  sub,
  actions,
  variant = "full",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  actions?: React.ReactNode;
  variant?: "full" | "lite";
}) {
  return (
    <section className="relative overflow-hidden">
      {variant === "full" && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image src="/backgrounddark.png" alt="" fill priority sizes="100vw" className="object-cover object-right opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
      )}
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        <div className="space-y-8">
          <p className="font-brand inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] text-sky [animation:fade-up_0.7s_both]">
            <span className="diamond" />
            {eyebrow}
          </p>
          <h1 className="text-4xl font-light leading-[1.08] tracking-tight text-foreground sm:text-5xl [animation:fade-up_0.7s_0.1s_both]">
            {title}
          </h1>
          {sub && (
            <p className="max-w-md text-base font-light leading-relaxed text-muted-foreground [animation:fade-up_0.7s_0.3s_both]">
              {sub}
            </p>
          )}
          {actions && <div className="flex flex-wrap items-center gap-4 [animation:fade-up_0.7s_0.4s_both]">{actions}</div>}
        </div>
        <div className="relative flex justify-center [animation:fade-up_0.9s_0.2s_both]">
          <CircuitPulse />
          <div
            aria-hidden
            className="absolute h-64 w-64 rounded-full [animation:breathe_4.5s_ease-in-out_infinite]"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-sky)/0.18), transparent 65%)" }}
          />
          <Falcon priority className="relative h-56 w-auto sm:h-72" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify + Commit**

Run: `pnpm exec tsc --noEmit` → no errors.
```bash
git add src/components/site/hero.tsx
git commit -m "feat(brand): Hero (full + lite)"
```

---

### Task 9: Branded `PageHeader` + `Prose` (protects CMS pages)

**Files:**
- Modify: `src/components/site/page-header.tsx`
- Modify: `src/app/globals.css` (`.prose` already themed; verify tokens after palette change)

- [ ] **Step 1: Refine `PageHeader`** — lighter weight, keep arabic optional, remove UAE assumptions (it already takes props; just tune weight):

In `page-header.tsx`, change the `<h1>` class:
```tsx
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
          {title}
        </h1>
```

- [ ] **Step 2: Verify `.prose` reads correctly** on the new palette.

Run `pnpm dev`, open any published post at `/blog/<slug>` → headings platinum, links sky, bullets teal, `hr` is the divider. If a token looks off, adjust the matching `--tw-prose-*` line in `globals.css`.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/page-header.tsx src/app/globals.css
git commit -m "style(cms): bank-grade PageHeader + verified prose theme"
```

---

## Phase 2 — Pages, Nav, Footer

### Task 10: Home page rebuild

**Files:**
- Modify: `src/app/(site)/page.tsx`

- [ ] **Step 1: Rebuild Home from brand components.** Replace the file with:
```tsx
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/server/public-content";
import { Hero } from "@/components/site/hero";
import { TrustStrip } from "@/components/site/trust-strip";
import { SectionHeading } from "@/components/site/section-heading";
import { CircuitBackground } from "@/components/site/brand/circuit-background";
import { ContactCta } from "@/components/site/contact-cta";
import { Falcon } from "@/components/site/brand/falcon";

const CAPABILITIES = [
  { ar: "ذكاء", title: "Intelligence", desc: "AI products that turn messy financial data into decisions banks can act on with confidence." },
  { ar: "أتمتة", title: "Automation", desc: "Mission-critical operations, automated end to end — fewer manual touchpoints, fewer errors." },
  { ar: "ضمان", title: "Assurance", desc: "Regulated-grade reliability, auditability, and security built in from the first commit." },
];

const PILLARS = [
  { ar: "اتصال ذكي", title: "Connect", desc: "Intelligent systems that link people, data, and services into one fabric." },
  { ar: "إبتكار مستمر", title: "Innovate", desc: "Relentless R&D turning tomorrow's models into products in production today." },
  { ar: "تقدم دائم", title: "Elevate", desc: "Performance that compounds — scalable, measured, built to endure." },
];

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="AI SOFTWARE FOR FINANCIAL INSTITUTIONS"
        title={<>Intelligent software<br />banks <span className="font-medium text-gradient">run on.</span></>}
        sub="GYR builds AI-driven products that move regulated, mission-critical operations forward — engineered for institutions that can't afford to get it wrong."
        actions={
          <>
            <Link href="#capabilities" className="font-brand rounded-md bg-gradient-to-r from-teal to-sky px-6 py-3 text-xs tracking-[0.18em] text-white shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5">
              SEE WHAT WE BUILD
            </Link>
            <Link href="/about" className="font-brand rounded-md border border-border px-6 py-3 text-xs tracking-[0.18em] text-foreground transition-colors hover:border-sky/60 hover:text-sky">
              OUR STORY
            </Link>
          </>
        }
      />

      <TrustStrip />

      {/* Capabilities */}
      <section id="capabilities" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <CircuitBackground />
        <SectionHeading eyebrow="WHAT WE BUILD" title="Software for the institutions that can't get it wrong." intro="Three things every GYR product is built to deliver." className="mb-12" />
        <div className="grid gap-6 md:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <article key={c.title} className="brand-card rounded-xl p-7" style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}>
              <p dir="rtl" className="font-arabic mb-1 text-sm text-teal">{c.ar}</p>
              <h3 className="mb-2 text-lg font-medium">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading eyebrow="HOW WE WORK" title="Connect. Innovate. Elevate." intro="Every engagement runs on three parallel currents — integrated like circuits across a falcon's wing." className="mb-12" />
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <article key={p.title} className="brand-card rounded-xl p-7" style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}>
              <p dir="rtl" className="font-arabic mb-1 text-sm text-teal">{p.ar}</p>
              <h3 className="mb-2 text-lg font-medium">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Latest insights */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <SectionHeading eyebrow="INSIGHTS" title="Latest thinking" />
          <Link href="/blog" className="font-brand hidden text-xs tracking-[0.18em] text-muted-foreground transition-colors hover:text-sky sm:block">ALL INSIGHTS →</Link>
        </div>
        {posts.length === 0 ? (
          <div className="brand-card rounded-xl p-12 text-center text-muted-foreground">No insights published yet.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="brand-card group flex flex-col overflow-hidden rounded-xl">
                {p.coverImage ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={p.coverImage.url} alt={p.coverImage.alt ?? p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="bg-grid flex aspect-[16/10] items-center justify-center bg-secondary/40">
                    <Falcon className="h-14 w-auto opacity-40" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-lg font-medium transition-colors group-hover:text-sky">{p.title}</h3>
                  {p.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <ContactCta />
    </>
  );
}
```
(Depends on `ContactCta` from Task 13. If executing strictly in order, do Task 13 first or temporarily omit the `<ContactCta />` line and add it after Task 13.)

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit` → no errors. `pnpm dev` `/` → hero, trust strip, capabilities on circuit texture, pillars, insights all render; no UAE copy.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/page.tsx"
git commit -m "feat(home): rebuild homepage on brand component system"
```

---

### Task 11: About page (coded route + CMS-editable middle)

**Files:**
- Create: `src/app/(site)/about/page.tsx`
- Modify: `src/lib/slugify.ts`

- [ ] **Step 1: Reserve the `about` slug** so a CMS page can't shadow the coded route. In `src/lib/slugify.ts`:
```ts
export const RESERVED_SLUGS = new Set(["admin", "api", "blog", "team", "about", ""]);
```

- [ ] **Step 2: Write the About route** (reads optional CMS `Page` slug `about` for the editable middle):

`src/app/(site)/about/page.tsx`:
```tsx
import Link from "next/link";
import { getPageBySlug } from "@/server/public-content";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CircuitDivider } from "@/components/site/brand/circuit-background";
import { Prose } from "@/components/site/prose";
import { ContactCta } from "@/components/site/contact-cta";

export const metadata = { title: "About" };

const PILLARS = [
  { ar: "اتصال ذكي", title: "Connect", desc: "Link people, data, and services into one intelligent fabric." },
  { ar: "إبتكار مستمر", title: "Innovate", desc: "Turn tomorrow's models into products in production today." },
  { ar: "تقدم دائم", title: "Elevate", desc: "Performance that compounds — scalable, measured, enduring." },
];
const VALUES = ["Vision", "Innovation", "Trust", "Precision", "Leadership"];

export default async function AboutPage() {
  const page = await getPageBySlug("about"); // optional editable narrative

  return (
    <>
      <Hero
        variant="lite"
        eyebrow="OUR STORY"
        title={<>The software layer<br />beneath modern <span className="font-medium text-gradient">finance.</span></>}
        sub="GYR is a technology company building AI-driven products for banks and the institutions that demand mission-critical reliability."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <CircuitDivider />
        <div className="py-14">
          {page?.body ? (
            <Prose doc={page.body} />
          ) : (
            <div className="space-y-5 text-lg font-light leading-relaxed text-muted-foreground">
              <p>We build software banks run on — AI products that move regulated, high-stakes operations forward without compromising trust.</p>
              <p>Our work sits where intelligence meets assurance: models that decide, automation that executes, and the auditability institutions require.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading eyebrow="HOW WE WORK" title="Connect. Innovate. Elevate." className="mb-12" />
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <article key={p.title} className="brand-card rounded-xl p-7" style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}>
              <p dir="rtl" className="font-arabic mb-1 text-sm text-teal">{p.ar}</p>
              <h3 className="mb-2 text-lg font-medium">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading eyebrow="WHAT WE STAND FOR" title="Values" className="mb-8" />
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {VALUES.map((v) => (
            <span key={v} className="font-brand text-[0.7rem] tracking-[0.28em] text-muted-foreground">{v.toUpperCase()}</span>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
```

- [ ] **Step 3: (Optional) Register an admin `Page` record** with slug `about`, `customLayout: true`, so the admin list badges it. This is data, not code — do it via the existing admin UI after deploy, or note as a follow-up. No code change required for the route to work.

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit` → no errors. `pnpm dev` `/about` → renders coded layout; with no CMS `about` page it shows the fallback narrative.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/about/page.tsx" src/lib/slugify.ts
git commit -m "feat(about): coded About route with CMS-editable middle"
```

---

### Task 12: Insights list + article restyle

**Files:**
- Modify: `src/app/(site)/blog/page.tsx`
- Modify: `src/app/(site)/blog/[slug]/page.tsx`

- [ ] **Step 1: List page** — update `PageHeader` props to drop "FROM THE TEAM"/team framing:
In `blog/page.tsx`, change the header to:
```tsx
      <PageHeader eyebrow="INSIGHTS" title="Insights" arabic="رؤى">
        Engineering notes, product thinking, and field reports from GYR.
      </PageHeader>
```
And soften card titles to `font-medium` (match new weight): change `text-lg font-semibold` → `text-lg font-medium` on the `<h2>`.

- [ ] **Step 2: Article page** — open `blog/[slug]/page.tsx`, ensure it uses `Prose` for the body and add a falcon footer mark + `CircuitDivider` after the article. Add imports and, after the prose content, append:
```tsx
import { Falcon } from "@/components/site/brand/falcon";
import { CircuitDivider } from "@/components/site/brand/circuit-background";
// ...after the article body:
<div className="mx-auto mt-16 max-w-3xl px-4 sm:px-6">
  <CircuitDivider />
  <div className="flex justify-center py-10">
    <Falcon className="h-10 w-auto opacity-50" />
  </div>
</div>
```
(Adapt to the file's existing structure; if it already renders `Prose`, only add the footer block + imports.)

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit` → no errors. `pnpm dev` `/blog` and a post → restyled, no team/UAE copy.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/blog/page.tsx" "src/app/(site)/blog/[slug]/page.tsx"
git commit -m "style(insights): restyle list + article, drop team framing"
```

---

### Task 13: `ContactCta` + Header + Footer

**Files:**
- Create: `src/components/site/contact-cta.tsx`
- Modify: `src/components/site/site-header.tsx`
- Modify: `src/components/site/site-footer.tsx`

- [ ] **Step 1: Write `ContactCta`** (closing band + lightweight form; form posts to `mailto:` for now — no backend in scope):

`src/components/site/contact-cta.tsx`:
```tsx
import { Falcon } from "@/components/site/brand/falcon";

export function ContactCta() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
      <div className="brand-card relative overflow-hidden rounded-2xl px-8 py-14 text-center sm:px-16">
        <div aria-hidden className="absolute inset-0 -z-10 bg-aura opacity-70" />
        <Falcon className="mx-auto mb-6 h-14 w-auto" />
        <h2 className="mx-auto max-w-2xl text-2xl font-light tracking-tight sm:text-3xl">
          Ready to build with GYR?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Tell us what your institution needs to move forward.
        </p>
        <form action="mailto:contact@gyr.ae" method="post" encType="text/plain" className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="Work email"
            className="flex-1 rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky"
          />
          <button type="submit" className="font-brand rounded-md bg-gradient-to-r from-teal to-sky px-6 py-3 text-xs tracking-[0.18em] text-white shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5">
            GET IN TOUCH
          </button>
        </form>
      </div>
    </section>
  );
}
```
(Confirm contact email with user; `contact@gyr.ae` is a placeholder address, not UAE positioning.)

- [ ] **Step 2: Header** — drop Team, add About + Contact; keep CMS nav pages. In `site-header.tsx` replace the `links` array:
```tsx
  const links = [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Insights" },
    { href: "/#contact", label: "Contact" },
    ...navPages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];
```

- [ ] **Step 3: Footer** — remove UAE line + Team link; restate. In `site-footer.tsx`:
  - Replace the `نبتكر المستقبل. نرتقي بالأداء.` block and the Latin tagline with neutral brand copy (keep Arabic wordmark elsewhere). Change the tagline paragraph to:
```tsx
          <p className="font-brand max-w-xs text-xs tracking-[0.15em] text-muted-foreground">
            AI SOFTWARE FOR FINANCIAL INSTITUTIONS.
          </p>
```
  - In NAVIGATE list, remove the Team `<li>`, add About and Contact:
```tsx
            <li><Link href="/" className="transition-colors hover:text-foreground">Home</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-foreground">About</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-foreground">Insights</Link></li>
            <li><Link href="/#contact" className="transition-colors hover:text-foreground">Contact</Link></li>
```
  - Replace the bottom `TECHNOLOGY FORWARD. UAE PROUD.` span with:
```tsx
          <span className="font-brand tracking-[0.25em] text-sky/80">
            INTELLIGENT SOFTWARE, ENGINEERED FOR TRUST.
          </span>
```

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit` → no errors. `pnpm dev` → header shows About · Insights · Contact (no Team); footer has no UAE; contact band renders on Home/About.

- [ ] **Step 5: Commit**

```bash
git add src/components/site/contact-cta.tsx src/components/site/site-header.tsx src/components/site/site-footer.tsx
git commit -m "feat(nav): ContactCta + header/footer (About+Contact, drop UAE+Team)"
```

---

## Phase 3 — Polish, Assets, QA

### Task 14: Favicons + OG image from lockups

**Files:**
- Create: `scripts/make-og.mjs`
- Output: `public/og.png` (+ regenerate favicons if needed)

- [ ] **Step 1: Write OG generator** `scripts/make-og.mjs`:
```js
// Compose a 1200x630 OG card: dark plate + horizontal lockup centered.
import sharp from "sharp";

const W = 1200, H = 630;
const bg = { create: { width: W, height: H, channels: 4, background: { r: 6, g: 11, b: 18, alpha: 1 } } };
const logo = await sharp("public/logoHorizentaldark.png").resize({ width: 720 }).toBuffer();
const lm = await sharp(logo).metadata();

await sharp(bg)
  .composite([{ input: logo, top: Math.round((H - lm.height) / 2), left: Math.round((W - lm.width) / 2) }])
  .png()
  .toFile("public/og.png");

console.log("wrote public/og.png 1200x630");
```

- [ ] **Step 2: Run + verify**

Run: `pnpm exec node scripts/make-og.mjs` → `wrote public/og.png 1200x630`. Open `public/og.png` → lockup centered on dark plate.

- [ ] **Step 3: Commit**

```bash
git add scripts/make-og.mjs public/og.png
git commit -m "chore(assets): generate OG card from lockup"
```

---

### Task 15: Clean up new public asset filenames in git + final QA

**Files:**
- Git: stage renamed/added public assets; remove the original `ChatGPT Image …png` files if still present.

- [ ] **Step 1: Stage the new brand assets and drop the old ChatGPT-named originals.**

```bash
git add public/loglight.png public/logoHorizentaldark.png public/logoHorizentallight.png \
  public/logowithnamedark.png public/logowithnamelight.png \
  public/backgrounddark.png public/backgroundlight.png \
  public/circuitsdark.png public/circuitslight.png
git rm --cached --ignore-unmatch "public/ChatGPT Image"*.png 2>/dev/null || true
```
Then delete any leftover originals from disk if they remain (only the clean-named files are referenced).

- [ ] **Step 2: Full typecheck + lint + build**

Run: `pnpm exec tsc --noEmit` → clean.
Run: `pnpm lint` → clean (fix any new warnings).
Run: `pnpm build` → succeeds.

- [ ] **Step 3: Visual QA pass** in `pnpm dev` across `/`, `/about`, `/blog`, a post, and a CMS-created page:
  - Falcon transparent everywhere, no box seam.
  - Circuit pulse subtle; reduced-motion (OS setting) stops animation.
  - No "UAE", "Dubai", "Technology Forward. UAE Proud." anywhere (grep).
  - Nav/footer links resolve (no `/team`).

Run: `grep -ri "uae\|dubai\|UAE PROUD" src/ ; echo done` → only matches should be intentional/none.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(assets): finalize public brand assets; redesign QA pass"
```

---

### Task 16: Update brand memory

**Files:**
- Modify: `C:/Users/Musa/.claude/projects/c--Users-Musa-repos-GYRsite/memory/gyr-visual-identity.md`

- [ ] **Step 1: Update the memory** to reflect: new `/public` asset names; `public/brand/*` deleted; `Falcon` now uses `/falcon.png` (transparent, chroma-keyed from `logowithnamedark.png` via `scripts/make-falcon.mjs`); UAE positioning removed; bank-grade Direction A palette; new brand components. Remove stale references to `public/brand/falcon.png` and UAE motifs.

- [ ] **Step 2: Commit** (memory dir may be outside the repo; if so, no commit needed — just save the file).

---

## Self-Review

**Spec coverage:** Visual system (Tasks 2,4,5) ✓ · palette refinement (Task 2) ✓ · typography (already wired; used at light weight in components) ✓ · real artwork + transparent falcon (Task 1) ✓ · matched SVG circuits (Task 4) ✓ · component library (Tasks 4–9) ✓ · Home (Task 10) ✓ · About coded + CMS-editable (Task 11) ✓ · Insights restyle (Task 12) ✓ · CMS integration: reserved slug + branded PageHeader/Prose + nav (Tasks 9,11,13) ✓ · Contact as section+form (Task 13) ✓ · no-UAE (Tasks 3,12,13,15) ✓ · favicons/OG (Task 14) ✓ · memory update (Task 16) ✓.

**Open items carried from spec (confirm during execution):** client logos (TrustStrip placeholder ready), nav lockup (horizontal default), Team route (left dormant, unlinked), contact email address, About editability (built as coded+CMS middle).

**Ordering note:** Task 10 (Home) imports `ContactCta` from Task 13 — either reorder Task 13 before Task 10, or add the `<ContactCta />` import/line when Task 13 lands. Flagged in Task 10.

**Type consistency:** `Falcon`, `Hero`, `SectionHeading`, `TrustStrip`, `CircuitPulse`, `CircuitBackground`/`CircuitDivider`, `ContactCta`, `Prose({doc})` signatures are used consistently across pages.
