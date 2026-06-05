import Image from "next/image";

/**
 * GYR falcon emblem — transparent teal mark for the dark UI. Chroma-keyed from
 * the dark vertical lockup via scripts/make-falcon.mjs. Intrinsic ratio 590x592;
 * size it with a height utility + w-auto.
 */
export function Falcon({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/falcon.png"
      alt=""
      aria-hidden
      width={590}
      height={592}
      priority={priority}
      className={className}
    />
  );
}
