import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/site/brand/logo";
import { siteConfig } from "@/lib/seo";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-border/60 bg-background sm:mt-24">
      <div className="absolute inset-x-0 top-0 rule" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-5">
          <Logo size="md" />
          <p
            className={
              locale === "ar"
                ? "font-arabic max-w-xs text-sm leading-relaxed text-muted-foreground"
                : "font-display max-w-xs text-xs leading-relaxed tracking-[0.16em] text-muted-foreground"
            }
          >
            {t("tagline")}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="space-y-3">
          <h4 className="font-display text-xs tracking-[0.16em] text-muted-foreground">{t("navigate")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="transition-colors hover:text-foreground">{tn("home")}</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-foreground">{tn("about")}</Link></li>
            <li><Link href="/#contact" className="transition-colors hover:text-foreground">{tn("contact")}</Link></li>
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
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>{t("rights", { year })}</span>
          <span className="font-display tracking-[0.16em] text-muted-foreground">
            {t("proud")}
          </span>
        </div>
      </div>
    </footer>
  );
}
