/**
 * One capability presented as a subsystem: index number, title, body, and a
 * mono sub-list with hairline separators. Used two-up for AI Automation /
 * Cybersecurity. The leading tick is direction-neutral (no Latin arrow), so it
 * reads correctly in RTL.
 */
export function CapabilityBlock({
  num,
  title,
  body,
  items,
  className = "",
}: {
  num: string;
  title: string;
  body: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="ins-label font-mono">{num}</span>
      <h3 className="font-display mt-3 text-2xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
      <ul className="mt-6">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-center border-t border-border/70 py-2.5 font-mono text-xs text-foreground"
          >
            <span className="brand-tick" aria-hidden />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
