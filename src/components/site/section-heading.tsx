/** Consistent section opener: display-font eyebrow + title + optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="font-display mb-3 flex items-center gap-3 text-[0.7rem] tracking-[0.16em] text-muted-foreground">
        <span className="brand-tick" />
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 leading-relaxed text-muted-foreground">{intro}</p>
      )}
    </div>
  );
}
