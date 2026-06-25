import type { ReactNode } from "react";

/**
 * Calm content section — a centered, generously-spaced column. The single
 * layout primitive every page composes from. Width is deliberately narrower
 * than the header (max-w-5xl) for an elegant reading measure.
 */
export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}
