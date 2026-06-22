export type ProcessStep = { sn: string; title: string; desc: string };

/**
 * Define → Design → Build → Operate, drawn as an instrument sequence.
 * `row` (home §03) = horizontal nodes with a connector rail; `column`
 * (/approach §01) = vertical, expanded. `sn` is the full mono step label
 * (e.g. "STEP 01"), composed by the caller so this component holds no copy.
 */
export function ProcessSequence({
  steps,
  orientation = "row",
}: {
  steps: ProcessStep[];
  orientation?: "row" | "column";
}) {
  if (orientation === "column") {
    return (
      <ol className="relative">
        {steps.map((s, i) => (
          <li key={s.sn} className="grid grid-cols-[2.5rem_1fr] gap-6 pb-10 last:pb-0">
            <div className="relative flex justify-center">
              <span className="z-10 mt-1 h-2.5 w-2.5 bg-foreground" aria-hidden />
              {i < steps.length - 1 && (
                <span className="absolute bottom-[-2.5rem] top-1 w-px bg-border" aria-hidden />
              )}
            </div>
            <div>
              <span className="ins-label font-mono">{s.sn}</span>
              <h3 className="font-display mt-1.5 text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.sn}>
          <div className="mb-4 flex items-center">
            <span className="h-2.5 w-2.5 shrink-0 bg-foreground" aria-hidden />
            {i < steps.length - 1 && (
              <span className="ms-2 hidden h-px flex-1 bg-border lg:block" aria-hidden />
            )}
          </div>
          <span className="ins-label font-mono">{s.sn}</span>
          <h3 className="font-display mt-1.5 text-lg font-semibold text-foreground">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}
