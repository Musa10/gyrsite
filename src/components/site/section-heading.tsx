/** Consistent section opener: Michroma eyebrow + title + optional intro. */
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
      <p className="font-brand mb-3 flex items-center gap-3 text-[0.7rem] tracking-[0.3em] text-sky">
        <span className="diamond" />
        {eyebrow}
      </p>
      <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 leading-relaxed text-muted-foreground">{intro}</p>
      )}
    </div>
  );
}
