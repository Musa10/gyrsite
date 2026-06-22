export type IndexRow = { num: string; name: string; desc: string; tag: string };

/**
 * Annotated index — a numbered, tagged list rendered like a parts list / table
 * of contents instead of a card grid. Hairline rule between rows.
 */
export function IndexTable({ rows }: { rows: IndexRow[] }) {
  return (
    <div role="list">
      {rows.map((r) => (
        <div
          key={r.num}
          role="listitem"
          className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-t border-border py-5 md:grid-cols-[3rem_1.1fr_1.7fr_5rem]"
        >
          <span className="ins-label font-mono">{r.num}</span>
          <h3 className="font-display text-base font-medium text-foreground">{r.name}</h3>
          <p className="col-span-2 text-sm leading-relaxed text-muted-foreground md:col-span-1">
            {r.desc}
          </p>
          <span className="ins-label font-mono md:text-end">{r.tag}</span>
        </div>
      ))}
    </div>
  );
}
