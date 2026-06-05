import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getNavPages } from "@/server/public-content";
import { Logo } from "@/components/site/brand/logo";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const navPages = await getNavPages(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-background">
      <div className="absolute inset-x-0 top-0 rule" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo size="md" />
          <p dir="rtl" className="font-arabic max-w-xs text-sm text-muted-foreground">
            {t("taglineArabic")}
          </p>
          <p className="font-display max-w-xs text-xs tracking-[0.15em] text-muted-foreground">
            {t("taglineLatin")}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-display text-xs tracking-[0.16em] text-muted-foreground">{t("navigate")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="transition-colors hover:text-foreground">{tn("home")}</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-foreground">{tn("about")}</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-foreground">{tn("insights")}</Link></li>
            <li><Link href="/#contact" className="transition-colors hover:text-foreground">{tn("contact")}</Link></li>
            {navPages.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="transition-colors hover:text-foreground">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-display text-xs tracking-[0.16em] text-muted-foreground">{t("principles")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="brand-tick" />{t("smartConnect")}</li>
            <li className="flex items-center gap-2"><span className="brand-tick" />{t("continuousInnovation")}</li>
            <li className="flex items-center gap-2"><span className="brand-tick" />{t("sustainedGrowth")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>{t("rights", { year })}</span>
          <span className="font-display tracking-[0.16em] text-muted-foreground">
            {t("proud")}
          </span>
        </div>
      </div>
    </footer>
  );
}
