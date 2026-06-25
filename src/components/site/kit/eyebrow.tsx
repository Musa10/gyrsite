import type { ReactNode } from "react";

/**
 * Small uppercase label — the calm replacement for the old mono "instrument"
 * label. The `.eyebrow` class sets size/tracking; on Arabic pages the unlayered
 * `[lang="ar"] .eyebrow` rule in globals.css zeroes the tracking so Arabic
 * letter-joining is preserved.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
