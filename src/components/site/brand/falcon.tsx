/**
 * GYR falcon/arrow mark — the brand symbol. Inline single-path SVG using
 * `currentColor`, so it inherits the surrounding text color and inverts for
 * dark mode with no second asset. Size with a height utility + `w-auto`.
 * Decorative by default (aria-hidden); pass a `title` to make it labelled.
 *
 * The path is authored on the shared wordmark grid (see logo.tsx), so the
 * standalone mark crops its viewBox to the path bounds (22..119 × 31..155) —
 * no phantom padding, the mark fills exactly the box the height utility sets.
 */
export const FALCON_PATH =
  "M22 31 L22 73 L63 112 L22 113 L22 155 L64 113 L119 113 L108 102 L96 102 Z";

export function FalconMark({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="22 31 97 124"
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d={FALCON_PATH} />
    </svg>
  );
}
