import type { ReactNode } from "react";

/**
 * Calm content section — a full-width band with a centered, generously-spaced
 * inner column (narrower than the header for an elegant reading measure).
 *
 * - `surface` drops the band onto the subtle grey `--surface` so the page
 *   alternates tone and gains rhythm without any colour.
 * - `divider` (default true) draws a full-bleed hairline at the top; set it
 *   false for the first section, which the hero already borders.
 */
export function Section({
  children,
  className = "",
  id,
  surface = false,
  divider = true,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  surface?: boolean;
  divider?: boolean;
}) {
  const band = [
    "scroll-mt-24",
    divider ? "border-t border-border" : "",
    surface ? "bg-surface" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={band}>
      <div className={`mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:px-8 ${className}`}>
        {children}
      </div>
    </section>
  );
}
