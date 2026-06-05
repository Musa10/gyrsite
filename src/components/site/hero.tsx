import type { ReactNode } from "react";
import { Falcon } from "@/components/site/brand/falcon";
import { CircuitPulse } from "@/components/site/brand/circuit-pulse";

const GLOW = {
  background:
    "radial-gradient(circle, hsl(var(--brand-sky)/0.16), transparent 65%)",
};

/**
 * Above-the-fold hero.
 *
 * `variant="full"` (Home) uses the real `backgrounddark.png` plate — which
 * already contains the falcon + circuit wing — as the single emblem source, so
 * we do NOT add a second foreground falcon (that would double the mark). The
 * plate is mirrored on RTL so its falcon sits opposite the text, never under it.
 *
 * `variant="lite"` (About) has no plate, so it renders the transparent falcon +
 * animated CircuitPulse in the visual cell (which flips sides automatically with
 * the grid under `dir="rtl"`).
 *
 * Content is passed in (title/sub/actions), so callers own localization and
 * locale-aware links.
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
    <section className="relative overflow-hidden">
      {isFull && (
        <div aria-hidden className="absolute inset-0 -z-10">
          {/* background-image swaps by theme; RTL mirror preserved via transform. */}
          <div className="plate-hero absolute inset-0 bg-cover bg-right opacity-90 rtl:-scale-x-100" />
          {/* Darken the text side; keep the falcon side clear. Flip on RTL. */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent rtl:bg-gradient-to-l" />
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
          {actions && (
            <div className="flex flex-wrap items-center gap-4 [animation:fade-up_0.7s_0.4s_both]">
              {actions}
            </div>
          )}
        </div>

        <div className="relative flex min-h-[18rem] items-center justify-center [animation:fade-up_0.9s_0.2s_both]">
          {isFull ? (
            // Plate supplies the falcon; CircuitPulse animates the wing's
            // circuitry (no foreground falcon → no doubling). Mirror it on RTL
            // so the traces fan the same way as the mirrored plate.
            <>
              <CircuitPulse className="rtl:-scale-x-100" />
              <div
                aria-hidden
                className="absolute h-72 w-72 rounded-full [animation:breathe_5s_ease-in-out_infinite]"
                style={GLOW}
              />
            </>
          ) : (
            <>
              <CircuitPulse />
              <div
                aria-hidden
                className="absolute h-64 w-64 rounded-full [animation:breathe_4.5s_ease-in-out_infinite]"
                style={GLOW}
              />
              <Falcon priority className="relative h-56 w-auto sm:h-72" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
