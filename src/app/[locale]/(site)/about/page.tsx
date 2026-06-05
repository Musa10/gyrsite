import { getTranslations } from "next-intl/server";
import { getPageBySlug } from "@/server/public-content";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CircuitDivider } from "@/components/site/brand/circuit-background";
import { Prose } from "@/components/site/prose";
import { ContactCta } from "@/components/site/contact-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const th = await getTranslations({ locale, namespace: "home" }); // shared pillars
  const page = await getPageBySlug("about", locale); // optional editable narrative

  const values = t("values").split(",");
  const pillars = [
    { ar: "اتصال ذكي", title: th("pillar1Title"), desc: th("pillar1Desc") },
    { ar: "إبتكار مستمر", title: th("pillar2Title"), desc: th("pillar2Desc") },
    { ar: "تقدم دائم", title: th("pillar3Title"), desc: th("pillar3Desc") },
  ];

  return (
    <>
      <Hero
        variant="lite"
        eyebrow={t("heroEyebrow")}
        title={t.rich("heroTitle", {
          accent: (chunks) => (
            <span className="font-medium text-gradient">{chunks}</span>
          ),
        })}
        sub={t("heroSub")}
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <CircuitDivider />
        <div className="py-14">
          {page?.body ? (
            <div dir={locale === "ar" ? "rtl" : "ltr"}>
              <Prose doc={page.body} />
            </div>
          ) : (
            <div className="space-y-5 text-lg font-light leading-relaxed text-muted-foreground">
              <p>{t("missionP1")}</p>
              <p>{t("missionP2")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow={th("pillarsEyebrow")}
          title={th("pillarsHeading")}
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="brand-card rounded-xl p-7"
              style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}
            >
              {locale === "en" && (
                <p dir="rtl" className="font-arabic mb-1 text-sm text-teal">
                  {p.ar}
                </p>
              )}
              <h3 className="mb-2 text-lg font-medium">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow={t("valuesEyebrow")}
          title={t("valuesTitle")}
          className="mb-8"
        />
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {values.map((v) => (
            <span
              key={v}
              className="font-brand text-[0.7rem] tracking-[0.28em] text-muted-foreground"
            >
              {locale === "ar" ? v : v.toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
