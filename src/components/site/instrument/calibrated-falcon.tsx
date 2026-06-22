import { FALCON_PATH } from "@/components/site/brand/falcon";

/**
 * The falcon mark presented as the calibrated subject of a technical drawing:
 * centered on a registration crosshair with a dimension line and mono
 * annotations. The mark is a logo — it is NOT mirrored in RTL, so the SVG is
 * wrapped in `dir="ltr"`; only the surrounding stage mirrors.
 */
export function CalibratedFalcon({
  fig = "FIG.01",
  caption = "FALCON / STOOP",
  className = "",
}: {
  fig?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={`ins-crosshair relative min-h-[16rem] border-s border-border ${className}`}
    >
      <div dir="ltr" className="absolute inset-0 grid place-items-center">
        <svg
          viewBox="22 31 97 124"
          fill="currentColor"
          aria-hidden
          className="h-[58%] w-auto text-foreground"
        >
          <path d={FALCON_PATH} />
        </svg>
      </div>
      <span className="ins-dim absolute inset-y-8 end-3" aria-hidden />
      <span className="ins-label font-mono absolute start-2 top-2">+ {fig}</span>
      <span className="ins-label font-mono absolute start-2 bottom-2">{caption}</span>
    </div>
  );
}
