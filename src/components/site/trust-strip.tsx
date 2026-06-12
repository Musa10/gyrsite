import Image from "next/image";

type Logo = { src: string; alt: string };

/**
 * Compact credibility row. Pass real client logos only when they are approved
 * for public use; otherwise render concrete operating standards. `label` is
 * required (no hardcoded fallback) so all copy stays in the locale catalogs.
 */
export function TrustStrip({
  label,
  logos = [],
  items = [],
}: {
  label: string;
  logos?: Logo[];
  items?: string[];
}) {
  return (
    <div className="border-y border-border/60 bg-background/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-4 px-4 py-6 sm:px-6">
        <span className="font-display text-[0.62rem] tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <div className="flex flex-wrap items-center gap-8 opacity-70">
          {logos.length > 0
            ? logos.map((l) => (
                <Image
                  key={l.src}
                  src={l.src}
                  alt={l.alt}
                  width={96}
                  height={24}
                  className="h-5 w-auto opacity-80"
                />
              ))
            : items.map((item) => (
                <span
                  key={item}
                  className="font-display rounded-md border border-border/60 px-3 py-1 text-[0.6rem] tracking-[0.16em] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
        </div>
      </div>
    </div>
  );
}
