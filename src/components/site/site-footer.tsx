import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/site/brand/logo";
import { siteConfig } from "@/lib/seo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: tn("home") },
    { href: "/services", label: tn("automation") },
    { href: "/services#security", label: tn("security") },
    { href: "/approach", label: tn("approach") },
    { href: "/about", label: tn("about") },
    { href: "/contact", label: tn("contact") },
  ];

  return (
    <footer className="relative mt-16 border-t border-border bg-surface/40 sm:mt-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="space-y-5">
          <Logo size="md" />
          <p className="ins-label font-mono max-w-xs leading-relaxed">{t("tagline")}</p>
        </div>

        <div className="space-y-3">
          <h4 className="ins-label font-mono">{t("navigate")}</h4>
          <ul className="space-y-2 font-mono text-sm text-muted-foreground">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="ins-label font-mono">{t("contactHeading")}</h4>
          <ul className="space-y-2 font-mono text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-foreground"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>{t("location")}</li>
            <li>{t("linkedin")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <span className="ins-label font-mono">{t("rights", { year })}</span>
          <span className="ins-label font-mono">{t("proud")}</span>
        </div>
      </div>
    </footer>
  );
}
