import type { ReactNode } from "react";

/**
 * Instrument section marker — `§0X — NAME` in tracked mono. The font + tracking
 * auto-resolve to IBM Plex Sans Arabic on Arabic pages via the unlayered
 * `[lang="ar"] .font-mono` rule in globals.css, so no per-locale branching here.
 */
export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`ins-label font-mono ${className}`}>
      <span aria-hidden>§{index} — </span>
      {children}
    </p>
  );
}
