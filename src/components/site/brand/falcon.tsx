/**
 * GYR falcon/arrow mark — the brand symbol. Inline single-path SVG using
 * `currentColor`, so it inherits the surrounding text color and inverts for
 * dark mode with no second asset. Size with a height utility + `w-auto`.
 * Decorative by default (aria-hidden); pass a `title` to make it labelled.
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
      viewBox="0 0 141 186"
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

/** Back-compat alias — older imports used `Falcon`. */
export const Falcon = FalconMark;
