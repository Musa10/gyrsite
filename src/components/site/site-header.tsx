import Link from "next/link";
import { getNavPages } from "@/server/public-content";
import { Logo } from "@/components/site/brand/logo";

export async function SiteHeader() {
  const navPages = await getNavPages();

  const links = [
    { href: "/blog", label: "Insights" },
    { href: "/team", label: "Team" },
    ...navPages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo size="sm" />

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="pointer-events-none absolute inset-x-3 -bottom-px h-px scale-x-0 bg-gradient-to-r from-teal to-sky transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <Link
          href="/admin"
          className="font-brand rounded-md border border-border/80 px-3 py-1.5 text-[0.7rem] tracking-[0.2em] text-muted-foreground transition-colors hover:border-sky/60 hover:text-foreground"
        >
          CMS
        </Link>
      </div>
    </header>
  );
}
