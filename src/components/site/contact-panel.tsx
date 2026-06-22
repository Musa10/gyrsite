/**
 * Contact §01 — the direct channel. Static site, no backend: a mailto link with
 * a pre-filled subject is the whole mechanism. Founder-forward line sits beside
 * it. Copy passed in by the page.
 */
export function ContactPanel({
  email,
  subject,
  ctaLabel,
  founderLine,
}: {
  email: string;
  subject: string;
  ctaLabel: string;
  founderLine: string;
}) {
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <a
          href={mailto}
          className="font-mono inline-block bg-foreground px-6 py-3 text-xs uppercase tracking-[0.12em] text-background transition-transform hover:-translate-y-0.5"
        >
          {ctaLabel}
        </a>
        <p className="font-mono mt-4 text-sm text-muted-foreground">
          <span aria-hidden>&gt; </span>
          <a href={mailto} className="hover:text-foreground">
            {email}
          </a>
        </p>
      </div>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground">{founderLine}</p>
    </div>
  );
}
