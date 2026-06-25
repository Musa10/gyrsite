import type { ReactNode } from "react";

export type ProcessStep = { n: string; title: ReactNode; body: ReactNode };

/**
 * Process sequence — a quiet numbered list, steps separated by hairline rules.
 * No connector lines, dots, glows, or motion: the calm equivalent of the old
 * instrument "process-sequence".
 */
export function ProcessSequence({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => (
        <li
          key={s.n}
          className={`grid gap-3 py-8 md:grid-cols-[auto_1fr] md:gap-10 ${
            i > 0 ? "border-t border-border" : ""
          }`}
        >
          <span className="font-display text-sm tabular-nums text-muted-foreground">
            {s.n}
          </span>
          <div>
            <h3 className="font-display text-lg font-normal">{s.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
