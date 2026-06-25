import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/seo";
import { Section } from "@/components/site/kit/section";
import { Statement } from "@/components/site/kit/statement";
import { btnPrimary, btnGhost } from "@/components/site/kit/button";

/**
 * Closing engagement band, shared by Home and interior pages. Static site, no
 * backend — a mailto with a pre-filled subject is the mechanism. Calm: a quiet
 * statement above a single pill action and the plain address.
 */
export async function ContactCta() {
  const t = await getTranslations("contact");
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(t("subject"))}`;

  return (
    <Section id="contact" className="scroll-mt-24 border-t border-border">
      <Statement>{t("heading")}</Statement>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a href={mailto} className={btnPrimary}>
          {t("cta")}
        </a>
        <a href={mailto} className={btnGhost}>
          {siteConfig.email}
        </a>
      </div>
    </Section>
  );
}
