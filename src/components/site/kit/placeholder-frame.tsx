import { FalconMark } from "@/components/site/brand/falcon";

/**
 * Intentional frame for a pending real asset (e.g. the founder photo, before
 * the content pass). A surface fill with a very faint matte falcon and a small
 * label — reads as a designed placeholder, never an apologetic "content pass"
 * box. The falcon is wrapped dir="ltr" so it never mirrors in RTL.
 */
export function PlaceholderFrame({
  label,
  ratio = "4 / 5",
}: {
  label: string;
  ratio?: string;
}) {
  return (
    <div
      className="placeholder-frame relative flex items-center justify-center overflow-hidden rounded-xl"
      style={{ aspectRatio: ratio }}
    >
      <span dir="ltr" aria-hidden className="opacity-[0.06]">
        <FalconMark className="h-28 w-auto" />
      </span>
      <span className="absolute bottom-3 start-3 text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
