import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { SectionLabel } from "@/components/site/instrument/section-label";
import { FounderProfile } from "@/components/site/founder-profile";
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
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tn = await getTranslations("nav");
  const ts = await getTranslations("seo");

  const values = t("values").split("|");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tn("home"), path: "/" },
          { name: ts("aboutTitle"), path: "/about" },
        ])}
      />

      <Hero
        variant="lite"
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
      />

      {/* §01 Who we are */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionLabel index="01" className="mb-8">{t("statementLabel")}</SectionLabel>
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>{t("statementP1")}</p>
          <p>{t("statementP2")}</p>
        </div>
      </section>

      {/* §02 From the founder */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <SectionLabel index="02" className="mb-10">{t("founderLabel")}</SectionLabel>
          <FounderProfile
            bio={[t("founderBio1"), t("founderBio2")]}
            name={t("founderName")}
            role={t("founderRole")}
            linkedinLabel={t("founderLinkedinLabel")}
            linkedinUrl={t("founderLinkedinUrl")}
            portraitLabel={t("founderPortrait")}
            draftLabel={t("founderDraft")}
          />
        </div>
      </section>

      {/* §03 What we stand for */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionLabel index="03" className="mb-8">{t("valuesLabel")}</SectionLabel>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {values.map((v) => (
            <span key={v} className="ins-label font-mono">{v}</span>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
