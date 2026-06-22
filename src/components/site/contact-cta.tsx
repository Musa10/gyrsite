import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/seo";

/**
 * Closing engagement band, shared by Home and interior pages. Static site, no
 * backend — a mailto with a pre-filled subject is the mechanism.
 */
export async function ContactCta() {
  const t = await getTranslations("contact");
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(t("subject"))}`;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="grid gap-8 border-t border-border pt-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <h2 className="font-display max-w-xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {t("heading")}
        </h2>
        <div className="lg:text-end">
          <a
            href={mailto}
            className="font-mono inline-block bg-foreground px-6 py-3 text-xs uppercase tracking-[0.12em] text-background transition-transform hover:-translate-y-0.5"
          >
            {t("cta")}
          </a>
          <p className="font-mono mt-4 text-sm text-muted-foreground">
            <span aria-hidden>&gt; </span>
            <a href={mailto} className="hover:text-foreground">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
