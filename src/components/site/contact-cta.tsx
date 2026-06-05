import { getTranslations } from "next-intl/server";
import { FalconMark } from "@/components/site/brand/falcon";

/**
 * Closing CTA band + lightweight contact form. The form posts to a mailto: for
 * now (no backend in scope). Copy is localized via the "contact" namespace.
 */
export async function ContactCta() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
      <div className="brand-card relative overflow-hidden rounded-2xl px-8 py-14 text-center sm:px-16">
        <FalconMark className="mx-auto mb-6 h-14 w-auto text-foreground/10" />
        <h2 className="font-display mx-auto max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("body")}</p>
        <form
          action="mailto:contact@gyr.ae"
          method="post"
          encType="text/plain"
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            required
            placeholder={t("placeholder")}
            className="flex-1 rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
          <button
            type="submit"
            className="font-display rounded-md bg-foreground px-6 py-3 text-xs tracking-[0.16em] text-background transition-transform hover:-translate-y-0.5"
          >
            {t("cta")}
          </button>
        </form>
      </div>
    </section>
  );
}
