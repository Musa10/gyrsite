import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { SectionLabel } from "@/components/site/instrument/section-label";
import { ProcessSequence } from "@/components/site/instrument/process-sequence";
import { ContactCta } from "@/components/site/contact-cta";
import { JsonLd } from "@/components/site/json-ld";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return createMetadata({
    locale,
    path: "/approach",
    title: t("approachTitle"),
    description: t("approachDescription"),
  });
}

export default async function ApproachPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("approach");
  const th = await getTranslations("home");
  const tn = await getTranslations("nav");
  const ts = await getTranslations("seo");

  const steps = [1, 2, 3, 4].map((n) => ({
    sn: `${th("stepWord")} 0${n}`,
    title: th(`step${n}Title`),
    desc: th(`step${n}Desc`),
  }));

  const principles = [1, 2, 3].map((n) => ({
    title: t(`principle${n}Title`),
    body: t(`principle${n}Body`),
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tn("home"), path: "/" },
          { name: ts("approachTitle"), path: "/approach" },
        ])}
      />

      <Hero
        variant="lite"
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
      />

      {/* §01 Method */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionLabel index="01" className="mb-10">{t("methodLabel")}</SectionLabel>
        <ProcessSequence steps={steps} orientation="column" />
      </section>

      {/* §02 Governance */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionLabel index="02" className="mb-8">{t("govLabel")}</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {t("govTitle")}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{t("govBody")}</p>
          </div>
        </div>
      </section>

      {/* §03 How we work */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionLabel index="03" className="mb-10">{t("principlesLabel")}</SectionLabel>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <article key={p.title} className="brand-card p-7">
              <span className="brand-tick" aria-hidden />
              <h3 className="font-display mb-2 mt-4 text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
