export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-10 sm:mb-14 [animation:fade-up_0.6s_both]">
      {eyebrow && (
        <p className="font-display mb-3 flex items-center text-[0.7rem] tracking-[0.16em] text-muted-foreground">
          <span className="brand-tick" />
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">
        {title}
      </h1>
      {children && <p className="mt-4 max-w-2xl text-muted-foreground">{children}</p>}
      <div className="mt-8 rule" />
    </header>
  );
}
