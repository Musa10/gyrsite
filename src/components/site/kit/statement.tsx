import type { ReactNode } from "react";

/**
 * Oversized calm pull-statement — a quiet moment of scale for a single idea.
 * Emphasis is the caller's job via <strong className="font-medium">, never a
 * colour. Light weight + tight tracking keep it elegant rather than loud.
 */
export function Statement({ children }: { children: ReactNode }) {
  return (
    <p className="font-display max-w-4xl text-balance text-2xl font-normal leading-snug tracking-[-0.01em] sm:text-3xl">
      {children}
    </p>
  );
}
