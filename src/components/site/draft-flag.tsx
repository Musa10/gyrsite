import type { ReactNode } from "react";

/**
 * Visible flag for content that is structurally in place but factually
 * unconfirmed (per the content-governance rule: nothing factual ships without
 * sign-off). Uses the functional `warning` state color — the one place color is
 * allowed in this otherwise-monochrome system.
 */
export function DraftFlag({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono mb-4 inline-block border border-warning/40 bg-warning/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-warning">
      {children}
    </span>
  );
}
