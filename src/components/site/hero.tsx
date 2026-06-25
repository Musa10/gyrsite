import type { ReactNode } from "react";
import { FalconMark } from "@/components/site/brand/falcon";
import { Eyebrow } from "@/components/site/kit/eyebrow";

/**
 * Hero. `variant="full"` (Home): centered, with the matte falcon as a calm
 * centerpiece above a large light-weight headline. `variant="lite"` (interior
 * pages): no mark, left-aligned, smaller. No grid, no glow, no chrome — the
 * locked calm/elegant language. Emphasis inside `title` is the caller's job
 * via <strong className="font-medium">, never a colour. The falcon is wrapped
 * dir="ltr" so it never mirrors in RTL.
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
  sub?: ReactNode;
  actions?: ReactNode;
  variant?: "full" | "lite";
}) {
  if (variant === "full") {
    return (
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-32 lg:px-8">
          <span dir="ltr" aria-hidden className="mb-9 text-foreground">
            <FalconMark className="h-16 w-auto" />
          </span>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display mt-5 max-w-3xl text-balance text-4xl font-light leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {sub ? (
            <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {sub}
            </p>
          ) : null}
          {actions ? (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {actions}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display mt-5 max-w-3xl text-balance text-3xl font-light leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {sub ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {sub}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
