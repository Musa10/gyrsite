import type { ReactNode } from "react";
import { FalconMark } from "@/components/site/brand/falcon";
import { Eyebrow } from "@/components/site/kit/eyebrow";

/**
 * Hero. `variant="full"` (Home): centered, with the matte falcon as a calm
 * centerpiece above a large light-weight headline. `variant="lite"` (interior
 * pages): no mark, left-aligned, smaller. No glow, no chrome. Elements settle
 * in once on load in a gentle stagger (mark-in + fade-up), reduced-motion-safe.
 * Emphasis inside `title` is the caller's job via <strong className="font-medium">,
 * never a colour. The falcon is wrapped dir="ltr" so it never mirrors in RTL.
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
          <span dir="ltr" aria-hidden className="mb-9 animate-mark-in text-foreground">
            <FalconMark className="h-16 w-auto" />
          </span>
          <Eyebrow className="animate-fade-up [animation-delay:140ms]">{eyebrow}</Eyebrow>
          <h1 className="font-display mt-5 max-w-3xl animate-fade-up text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] [animation-delay:220ms] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {sub ? (
            <p className="mt-6 max-w-xl animate-fade-up text-balance text-base leading-relaxed text-muted-foreground [animation-delay:300ms] sm:text-lg">
              {sub}
            </p>
          ) : null}
          {actions ? (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 animate-fade-up [animation-delay:380ms]">
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
        <Eyebrow className="animate-fade-up">{eyebrow}</Eyebrow>
        <h1 className="font-display mt-5 max-w-3xl animate-fade-up text-balance text-3xl font-normal leading-[1.08] tracking-[-0.02em] [animation-delay:120ms] sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {sub ? (
          <p className="mt-5 max-w-2xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:200ms]">
            {sub}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 animate-fade-up [animation-delay:280ms]">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
