import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getNavPages } from "@/server/public-content";
import { Logo } from "@/components/site/brand/logo";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const navPages = await getNavPages(locale);
  const isAr = locale === "ar";

  const links = [
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("insights") },
    { href: "/#contact", label: t("contact") },
    ...navPages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  // Latin nav uses tracked uppercase labels (Swiss eyebrow style); Arabic keeps
  // natural case with no tracking (tracking breaks Arabic letter-joining).
  const linkType = isAr
    ? "font-arabic text-[0.95rem]"
    : "text-[0.72rem] uppercase tracking-[0.16em]";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo href="/" size="md" />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative py-2 text-muted-foreground transition-colors hover:text-foreground ${linkType}`}
            >
              {l.label}
              <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
