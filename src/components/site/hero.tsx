import type { ReactNode } from "react";
import Image from "next/image";
import { Falcon } from "@/components/site/brand/falcon";
import { CircuitPulse } from "@/components/site/brand/circuit-pulse";

/**
 * Above-the-fold hero. `variant="full"` (Home) uses the background plate +
 * emblem + circuit pulse. `variant="lite"` (About) drops the plate for calm.
 *
 * Content is passed in (title/sub/actions), so callers own localization and
 * locale-aware links — this component stays i18n-agnostic.
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
  return (
    <section className="relative overflow-hidden">
      {variant === "full" && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src="/backgrounddark.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right opacity-60"
          />
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
          {actions && (
            <div className="flex flex-wrap items-center gap-4 [animation:fade-up_0.7s_0.4s_both]">
              {actions}
            </div>
          )}
        </div>
        <div className="relative flex justify-center [animation:fade-up_0.9s_0.2s_both]">
          <CircuitPulse />
          <div
            aria-hidden
            className="absolute h-64 w-64 rounded-full [animation:breathe_4.5s_ease-in-out_infinite]"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--brand-sky)/0.18), transparent 65%)",
            }}
          />
          <Falcon priority className="relative h-56 w-auto sm:h-72" />
        </div>
      </div>
    </section>
  );
}
