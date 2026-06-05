import type { CSSProperties } from "react";

/**
 * Ambient circuit overlay that extends the falcon wing's language out into the
 * page: teal->cyan traces fanning up-and-right from an origin near the emblem,
 * with a traveling pulse, blinking nodes, and a breathing glow.
 *
 * Pure SVG/CSS; pointer-events:none; honors prefers-reduced-motion via the
 * global media query in globals.css (it neutralizes animation-duration).
 */
export function CircuitPulse({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
    >
      <defs>
        <linearGradient id="gyr-wing" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--brand-teal))" />
          <stop offset="55%" stopColor="hsl(var(--brand-teal))" />
          <stop offset="100%" stopColor="hsl(var(--brand-sky))" />
        </linearGradient>
      </defs>

      {/* static traces (matched to wing direction) */}
      <g stroke="url(#gyr-wing)" strokeWidth="1.1" opacity="0.5">
        <path d="M640 300 L740 240 L860 240" />
        <path d="M640 300 L760 300 L880 250" />
        <path d="M640 300 L720 200 L840 150" />
        <path d="M640 300 L700 150 L760 70" />
        <path d="M640 300 L560 240 L420 240" />
        <path d="M640 300 L540 300 L380 320" />
        <path d="M640 300 L580 360 L460 420" />
      </g>

      {/* blinking nodes — brighter toward tips */}
      <g>
        {[
          [740, 240],
          [860, 240],
          [880, 250],
          [840, 150],
          [760, 70],
          [420, 240],
          [380, 320],
          [460, 420],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={2.8}
            fill="hsl(var(--brand-sky))"
            style={{
              animation: `node-blink ${2.4 + (i % 4) * 0.4}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </g>

      {/* traveling pulse along a tip-ward trace */}
      <path
        d="M640 300 L720 200 L840 150"
        stroke="hsl(var(--brand-sky))"
        strokeWidth="1.8"
        strokeDasharray="34 360"
        style={
          {
            "--trace-len": "400",
            animation: "pulse-trace 3.2s linear infinite",
          } as CSSProperties
        }
        opacity="0.9"
      />
    </svg>
  );
}
