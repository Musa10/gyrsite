import type { ReactNode } from "react";

export type SpecMeta = { label: string; value: string };

/**
 * Spec-sheet header — the cover-of-a-technical-document layout used by the home
 * hero and every interior page header. Three optional zones:
 *   [ metadata margin | eyebrow + headline + rule + standfirst + action | aside ]
 * The aside slot carries the calibrated falcon on the home hero. Columns use
 * logical borders so the layout mirrors correctly in RTL; the falcon inside the
 * aside is kept un-mirrored by the CalibratedFalcon component itself.
 */
export function SpecHeader({
  meta,
  eyebrow,
  title,
  standfirst,
  action,
  aside,
  className = "",
}: {
  meta?: SpecMeta[];
  eyebrow?: string;
  title: ReactNode;
  standfirst?: ReactNode;
  action?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  const cols =
    meta && aside
      ? "lg:grid-cols-[5.5rem_minmax(0,1fr)_13rem]"
      : meta
        ? "lg:grid-cols-[5.5rem_minmax(0,1fr)]"
        : aside
          ? "lg:grid-cols-[minmax(0,1fr)_13rem]"
          : "";

  return (
    <div className={`grid gap-10 ${cols} ${className}`}>
      {meta && (
        <dl className="ins-label font-mono hidden self-start border-border lg:block lg:border-e lg:pe-4 [animation:fade-up_0.7s_both]">
          {meta.map((m) => (
            <div key={m.label} className="mb-4">
              <dt className="text-muted-foreground">{m.label}</dt>
              <dd className="mt-0.5 text-foreground">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="min-w-0">
        {eyebrow && (
          <p className="ins-label font-mono mb-5 [animation:fade-up_0.7s_both]">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-[3.3rem] [animation:fade-up_0.7s_0.1s_both]">
          {title}
        </h1>
        <div className="rule my-7 max-w-md [animation:fade-up_0.7s_0.2s_both]" />
        {standfirst && (
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground [animation:fade-up_0.7s_0.3s_both]">
            {standfirst}
          </p>
        )}
        {action && (
          <div className="mt-8 flex flex-wrap items-center gap-4 [animation:fade-up_0.7s_0.4s_both]">
            {action}
          </div>
        )}
      </div>

      {aside && (
        <div className="hidden lg:block [animation:fade-up_0.9s_0.2s_both]">{aside}</div>
      )}
    </div>
  );
}
