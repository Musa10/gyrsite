export function PageHeader({
  eyebrow,
  title,
  arabic,
  children,
}: {
  eyebrow?: string;
  title: string;
  arabic?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-12 [animation:fade-up_0.6s_both]">
      {eyebrow && (
        <p className="font-display mb-3 flex items-center gap-3 text-[0.7rem] tracking-[0.16em] text-muted-foreground">
          <span className="brand-tick" />
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {arabic && (
          <span dir="rtl" className="font-arabic text-2xl text-muted-foreground">
            {arabic}
          </span>
        )}
      </div>
      {children && <p className="mt-4 max-w-2xl text-muted-foreground">{children}</p>}
      <div className="mt-8 rule" />
    </header>
  );
}
