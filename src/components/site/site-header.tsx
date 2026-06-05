import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getNavPages } from "@/server/public-content";
import { LocaleSwitcher } from "@/components/site/locale-switcher";

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

  // EN nav labels use the Michroma label system (uppercase, tracked) to echo the
  // site's eyebrows and the wordmark. Arabic keeps its natural case with no
  // letter-spacing — tracking breaks Arabic letter-joining.
  const linkType = isAr
    ? "font-arabic text-[0.95rem]"
    : "font-brand text-[0.7rem] uppercase tracking-[0.16em]";

  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-border/60 bg-background/70 backdrop-blur-xl">
      {/* Circuit-trace texture, faded so it never competes with the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/circuitsdark.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right opacity-[0.55] mix-blend-screen [mask-image:linear-gradient(to_left,black,transparent_60%)]"
        />
      </div>

      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="GYR — home"
          className="inline-flex items-center transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo-horizontal.png"
            alt="GYR"
            width={1387}
            height={402}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative py-2 text-muted-foreground transition-colors hover:text-foreground ${linkType}`}
            >
              {l.label}
              <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px scale-x-0 bg-gradient-to-r from-teal to-sky transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <LocaleSwitcher />
      </div>
    </header>
  );
}
