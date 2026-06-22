import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/site/brand/logo";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";

export async function SiteHeader() {
  const t = await getTranslations("nav");

  const links = [
    { href: "/services#automation", label: t("automation") },
    { href: "/services#security", label: t("security") },
    { href: "/approach", label: t("approach") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href="/" size="md" />

        {/* Mono nav. Tracking + uppercase auto-resolve to Plex Arabic with zero
            tracking on Arabic pages via the unlayered [lang="ar"] .font-mono rule. */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="ins-label font-mono group relative py-2 transition-colors hover:text-foreground"
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
