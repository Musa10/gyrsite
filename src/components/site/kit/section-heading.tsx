import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

/**
 * Section heading — optional eyebrow, a large light-weight display title, and
 * an optional muted standfirst. Hierarchy comes from size/weight/space, never
 * colour. Emphasis inside `title` is the caller's job (wrap a word in
 * <strong className="font-medium">), never an accent hue.
 */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "start",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: "start" | "center";
}) {
  const alignCls =
    align === "center" ? "items-center text-center" : "items-start text-start";
  return (
    <div className={`flex flex-col gap-4 ${alignCls}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display max-w-2xl text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
        {title}
      </h2>
      {sub ? (
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
