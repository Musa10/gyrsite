import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactCta } from "@/components/site/contact-cta";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return createMetadata({
    locale,
    path: "/about",
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const th = await getTranslations({ locale, namespace: "home" }); // shared pillars

  const values = t("values").split(",");
  const pillars = [
    { title: th("pillar1Title"), desc: th("pillar1Desc") },
    { title: th("pillar2Title"), desc: th("pillar2Desc") },
    { title: th("pillar3Title"), desc: th("pillar3Desc") },
  ];

  return (
    <>
      <Hero
        variant="lite"
        eyebrow={t("heroEyebrow")}
        title={t.rich("heroTitle", {
          accent: (chunks) => (
            <span className="font-medium text-foreground">{chunks}</span>
          ),
        })}
        sub={t("heroSub")}
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>{t("missionP1")}</p>
          <p>{t("missionP2")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <SectionHeading
          eyebrow={th("pillarsEyebrow")}
          title={th("pillarsHeading")}
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="brand-card rounded-lg p-7"
              style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}
            >
              <span className="brand-tick" aria-hidden />
              <h3 className="mb-2 mt-4 text-lg font-medium">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <SectionHeading
          eyebrow={t("valuesEyebrow")}
          title={t("valuesTitle")}
          className="mb-8"
        />
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {values.map((v) => (
            <span
              key={v}
              className="font-display text-[0.7rem] tracking-[0.16em] text-muted-foreground"
            >
              {v.trim().toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
