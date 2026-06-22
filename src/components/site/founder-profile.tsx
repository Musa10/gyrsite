import { DraftFlag } from "@/components/site/draft-flag";

/**
 * About §02 — the expanded founder profile (larger portrait, full bio). Same
 * flagged-placeholder discipline as FounderNote.
 */
export function FounderProfile({
  bio,
  name,
  role,
  linkedinLabel,
  linkedinUrl,
  portraitLabel,
  draftLabel,
}: {
  bio: string[];
  name: string;
  role: string;
  linkedinLabel: string;
  linkedinUrl: string;
  portraitLabel: string;
  draftLabel?: string;
}) {
  return (
    <div className="grid gap-10 md:grid-cols-[240px_1fr] md:gap-14">
      <div>
        <div className="ins-hatch flex aspect-[4/5] w-full items-center justify-center border border-border font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">
          {portraitLabel}
        </div>
        <p className="font-display mt-5 text-lg font-semibold text-foreground">{name}</p>
        <p className="ins-label font-mono mt-1">{role}</p>
        <a
          href={linkedinUrl}
          className="ins-label font-mono mt-2 inline-block text-foreground underline-offset-4 hover:underline"
        >
          {linkedinLabel}
          <span aria-hidden> ↗</span>
        </a>
      </div>
      <div>
        {draftLabel && <DraftFlag>{draftLabel}</DraftFlag>}
        {bio.map((p, i) => (
          <p key={i} className="mb-5 text-base leading-relaxed text-muted-foreground last:mb-0">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
