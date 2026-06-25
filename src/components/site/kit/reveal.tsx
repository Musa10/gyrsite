"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Quiet scroll-reveal wrapper. Renders a div that starts faintly lowered and
 * faded (via the [data-reveal] rule in globals.css) and lifts in once when it
 * scrolls into view. The reveal is a presentational attribute toggled directly
 * on the DOM node (no React state → no re-render), and the observer disconnects
 * after the first reveal. Falls back to visible where IntersectionObserver is
 * unavailable; the [data-reveal] reduced-motion rule shows it instantly too.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => el.setAttribute("data-shown", "");

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
