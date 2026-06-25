import { PlaceholderFrame } from "@/components/site/kit/placeholder-frame";

/**
 * The founder's signed note (Home + reused on About). Portrait is an
 * intentional PlaceholderFrame until an approved photo lands. All copy is
 * passed in by the page. Calm/monochrome — no draft pills, no mono.
 */
export function FounderNote({
  quote,
  name,
  role,
  linkedinLabel,
  linkedinUrl,
  portraitLabel,
}: {
  quote: string;
  name: string;
  role: string;
  linkedinLabel: string;
  linkedinUrl: string;
  portraitLabel: string;
}) {
  return (
    <div className="grid gap-10 md:grid-cols-[180px_1fr] md:items-center md:gap-14">
      <div className="w-[180px]">
        <PlaceholderFrame label={portraitLabel} />
      </div>
      <div>
        <blockquote className="font-display text-balance text-xl font-light leading-snug tracking-[-0.01em] sm:text-2xl">
          {quote}
        </blockquote>
        <div className="mt-6">
          <div className="font-display text-base font-medium">{name}</div>
          <div className="mt-0.5 text-sm text-muted-foreground">{role}</div>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lift mt-3 inline-block border-b border-border pb-0.5 text-sm text-muted-foreground hover:border-foreground hover:text-foreground"
          >
            {linkedinLabel} <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
