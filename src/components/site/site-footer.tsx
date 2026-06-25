import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/site/brand/logo";
import { siteConfig } from "@/lib/seo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const year = new Date().getFullYear();

  // Single-page site: footer nav scrolls to sections on Home.
  const navLinks = [
    { href: "#capabilities", label: tn("capabilities") },
    { href: "#approach", label: tn("approach") },
    { href: "#contact", label: tn("contact") },
  ];

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div className="space-y-5">
          <Logo size="md" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">{t("navigate")}</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">{t("contactHeading")}</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-foreground"
              >
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 sm:flex-row lg:px-8">
          <span className="text-xs text-muted-foreground">{t("rights", { year })}</span>
          <span className="text-xs text-muted-foreground">{t("proud")}</span>
        </div>
      </div>
    </footer>
  );
}
