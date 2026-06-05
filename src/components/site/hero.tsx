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
