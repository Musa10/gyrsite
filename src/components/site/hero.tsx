import type { ReactNode } from "react";
import { SpecHeader, type SpecMeta } from "@/components/site/instrument/spec-header";
import { CalibratedFalcon } from "@/components/site/instrument/calibrated-falcon";

/**
 * Hero — a spec-sheet header. `variant="full"` (Home) shows the ambient
 * hairline grid, the metadata margin, and the calibrated falcon as the cover's
 * measured subject. `variant="lite"` (interior pages) is a quieter band with no
 * metadata/falcon. Content is passed in, so callers own localization.
 */
export function Hero({
  eyebrow,
  title,
  sub,
  actions,
  meta,
  variant = "full",
  fig,
  figCaption,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  meta?: SpecMeta[];
  variant?: "full" | "lite";
  fig?: string;
  figCaption?: string;
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
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <SpecHeader
          meta={isFull ? meta : undefined}
          eyebrow={eyebrow}
          title={title}
          standfirst={sub}
          action={actions}
          aside={isFull ? <CalibratedFalcon fig={fig} caption={figCaption} className="h-full" /> : undefined}
        />
      </div>
    </section>
  );
}
