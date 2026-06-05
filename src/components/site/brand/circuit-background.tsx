import Image from "next/image";

/** Static circuit-texture plate, darkened so text stays readable on top. */
export function CircuitBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    >
      <Image
        src="/circuitsdark.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.10]"
      />
      <div className="absolute inset-0 bg-background/40" />
    </div>
  );
}

/** Hairline brand divider with a node accent (reuses .rule-glow). */
export function CircuitDivider({ className = "" }: { className?: string }) {
  return <div className={`rule-glow ${className}`} />;
}
