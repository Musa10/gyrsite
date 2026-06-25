import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/seo";
import { Statement } from "@/components/site/kit/statement";
import { Reveal } from "@/components/site/kit/reveal";

/**
 * Closing engagement band, shared by Home and interior pages. A full-bleed
 * high-contrast block — inverted to `bg-foreground`/`text-background`, so it
 * reads as near-black in light theme and near-white in dark. The bold anchor
 * that keeps the page from feeling faint. Static site: a mailto with a
 * pre-filled subject is the mechanism.
 */
export async function ContactCta() {
  const t = await getTranslations("contact");
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(t("subject"))}`;

  return (
    <section id="contact" className="scroll-mt-24 bg-foreground text-background">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:px-8">
        <Reveal>
          <Statement>{t("heading")}</Statement>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={mailto}
              className="inline-flex items-center justify-center rounded-full bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              {t("cta")}
            </a>
            <a
              href={mailto}
              className="inline-flex items-center gap-1.5 text-sm text-background/70 transition-colors hover:text-background"
            >
              {siteConfig.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
