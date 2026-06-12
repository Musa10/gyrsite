import { getTranslations } from "next-intl/server";
import { FalconMark } from "@/components/site/brand/falcon";
import { siteConfig } from "@/lib/seo";

/**
 * Closing CTA band. Uses a direct email link until a real lead capture backend
 * exists.
 */
export async function ContactCta() {
  const t = await getTranslations("contact");
  const mailto = `mailto:${siteConfig.email}?subject=GYR%20Technology%20inquiry`;

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="brand-card relative overflow-hidden rounded-lg px-6 py-12 text-center sm:px-16 sm:py-16">
        <FalconMark className="mx-auto mb-6 h-10 w-auto text-foreground/10" />
        <h2 className="font-display mx-auto max-w-2xl text-2xl font-semibold sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("body")}</p>
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4">
          <a
            href={mailto}
            className="font-display rounded-md bg-foreground px-6 py-3 text-xs tracking-[0.16em] text-background transition-transform hover:-translate-y-0.5"
          >
            {t("cta")}
          </a>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t("emailLabel")}: </span>
            <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
