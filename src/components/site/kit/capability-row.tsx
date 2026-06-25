import type { ReactNode } from "react";

/**
 * Capability row — an editorial two-column entry (index + title | body), NOT a
 * bordered card in a grid. Rows stack and are separated by a hairline top
 * border, so a list of them reads as a quiet index rather than a feature grid.
 */
export function CapabilityRow({
  index,
  title,
  body,
  items,
}: {
  index: string;
  title: ReactNode;
  body: ReactNode;
  items?: string[];
}) {
  return (
    <div className="group grid gap-6 border-t border-border py-10 transition-colors duration-300 hover:border-foreground/25 md:grid-cols-[1fr_1.8fr] md:gap-10">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-sm tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {index}
        </span>
        <h3 className="font-display text-xl font-normal tracking-tight">
          {title}
        </h3>
      </div>
      <div className="max-w-2xl">
        <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
        {items && items.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-2">
            {items.map((it) => (
              <li key={it} className="flex gap-3 text-sm text-foreground/80">
                <span aria-hidden className="text-muted-foreground">
                  —
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
