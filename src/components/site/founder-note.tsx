import { DraftFlag } from "@/components/site/draft-flag";

/**
 * Home §04 — the founder's signed note. Portrait is a flagged placeholder until
 * an approved photo lands in /public. All copy is passed in by the page.
 */
export function FounderNote({
  quote,
  name,
  role,
  linkedinLabel,
  linkedinUrl,
  portraitLabel,
  draftLabel,
}: {
  quote: string;
  name: string;
  role: string;
  linkedinLabel: string;
  linkedinUrl: string;
  portraitLabel: string;
  draftLabel?: string;
}) {
  return (
    <div className="grid items-center gap-8 sm:grid-cols-[150px_1fr] sm:gap-10">
      <div className="ins-hatch flex aspect-[5/6] w-[150px] items-center justify-center border border-border font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">
        {portraitLabel}
      </div>
      <div>
        {draftLabel && <DraftFlag>{draftLabel}</DraftFlag>}
        <blockquote className="font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
          {quote}
        </blockquote>
        <p className="font-display mt-5 text-xl italic text-foreground">{name}</p>
        <p className="ins-label font-mono mt-1.5">
          {role}
          <span aria-hidden> · </span>
          <a href={linkedinUrl} className="text-foreground underline-offset-4 hover:underline">
            {linkedinLabel}
          </a>
        </p>
      </div>
    </div>
  );
}
