import Link from "next/link";
import { Falcon } from "./falcon";

type Variant = "horizontal" | "stacked" | "icon";

const SIZES = {
  sm: { mark: "h-9", latin: "text-base tracking-[0.32em]", ar: "text-sm" },
  md: { mark: "h-11", latin: "text-xl tracking-[0.34em]", ar: "text-base" },
  lg: { mark: "h-24", latin: "text-3xl tracking-[0.38em]", ar: "text-2xl" },
} as const;

function Wordmark({
  size,
  stacked,
}: {
  size: keyof typeof SIZES;
  stacked?: boolean;
}) {
  const s = SIZES[size];
  return (
    <span
      className={`flex ${stacked ? "flex-col items-center gap-1" : "flex-col"} leading-none`}
    >
      <span dir="rtl" className={`font-arabic font-medium text-gradient ${s.ar}`}>
        جير
      </span>
      <span className={`font-brand text-foreground ${s.latin}`}>GYR</span>
    </span>
  );
}

export function Logo({
  variant = "horizontal",
  size = "md",
  href = "/",
  className = "",
  priority = false,
}: {
  variant?: Variant;
  size?: keyof typeof SIZES;
  href?: string | null;
  className?: string;
  priority?: boolean;
}) {
  const s = SIZES[size];
  const mark = <Falcon className={`${s.mark} w-auto`} priority={priority} />;

  const inner =
    variant === "icon" ? (
      mark
    ) : variant === "stacked" ? (
      <span className="flex flex-col items-center gap-3">
        {mark}
        <Wordmark size={size} stacked />
      </span>
    ) : (
      <span className="flex items-center gap-3">
        {mark}
        <Wordmark size={size} />
      </span>
    );

  if (href === null) {
    return <span className={className}>{inner}</span>;
  }
  return (
    <Link
      href={href}
      aria-label="GYR — home"
      className={`group inline-flex transition-opacity hover:opacity-90 ${className}`}
    >
      {inner}
    </Link>
  );
}
