import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { SectionLabel } from "@/components/site/instrument/section-label";
import { CapabilityBlock } from "@/components/site/instrument/capability-block";
import { IndexTable } from "@/components/site/instrument/index-table";
import { DraftFlag } from "@/components/site/draft-flag";
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
    path: "/services",
    title: t("servicesTitle"),
    description: t("servicesDescription"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const th = await getTranslations("home");
  const tn = await getTranslations("nav");
  const ts = await getTranslations("seo");

  const buildRows = ["build1", "build2", "build3", "build4", "build5"].map((k, i) => {
    const [name, desc, tag] = th(k).split("|");
    return { num: String(i + 1).padStart(2, "0"), name, desc, tag };
  });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tn("home"), path: "/" },
          { name: ts("servicesTitle"), path: "/services" },
        ])}
      />

      <Hero
        variant="lite"
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
      />

      {/* §01 AI Automation */}
      <section id="automation" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionLabel index="01" className="mb-10">{t("autoLabel")}</SectionLabel>
        <CapabilityBlock
          num={th("cap1Num")}
          title={th("cap1Title")}
          body={th("cap1Body")}
          items={th("cap1Items").split("|")}
        />
      </section>

      {/* §02 Cybersecurity */}
      <section id="security" className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <SectionLabel index="02" className="mb-10">{t("cyberLabel")}</SectionLabel>
          <CapabilityBlock
            num={th("cap2Num")}
            title={th("cap2Title")}
            body={th("cap2Body")}
            items={th("cap2Items").split("|")}
          />
        </div>
      </section>

      {/* §03 What we build */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <SectionLabel index="03">{t("buildLabel")}</SectionLabel>
          <DraftFlag>{t("note")}</DraftFlag>
        </div>
        <IndexTable rows={buildRows} />
      </section>

      <ContactCta />
    </>
  );
}
