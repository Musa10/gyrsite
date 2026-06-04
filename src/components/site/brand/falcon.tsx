import Image from "next/image";

/**
 * GYR falcon mark — the official brand emblem (teal line falcon, transparent),
 * extracted from the brand asset sheet and keyed to transparency for use on the
 * dark UI. Intrinsic ratio 278x246; size it with a height utility + w-auto.
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
      src="/brand/falcon.png"
      alt=""
      aria-hidden
      width={278}
      height={246}
      priority={priority}
      className={className}
    />
  );
}
