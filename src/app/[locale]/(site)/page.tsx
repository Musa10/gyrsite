import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/site/hero";
import { SectionLabel } from "@/components/site/instrument/section-label";
import { CapabilityBlock } from "@/components/site/instrument/capability-block";
import { IndexTable } from "@/components/site/instrument/index-table";
import { ProcessSequence } from "@/components/site/instrument/process-sequence";
import { FounderNote } from "@/components/site/founder-note";
import { DraftFlag } from "@/components/site/draft-flag";
import { ContactCta } from "@/components/site/contact-cta";
import { JsonLd } from "@/components/site/json-ld";
import { createMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return createMetadata({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tf = await getTranslations("about"); // founder copy is canonical in the about namespace

  const meta = [
    { label: t("metaDocLabel"), value: t("metaDocValue") },
    { label: t("metaRevLabel"), value: t("metaRevValue") },
    { label: t("metaClassLabel"), value: t("metaClassValue") },
    { label: t("metaOriginLabel"), value: t("metaOriginValue") },
  ];

  const buildRows = ["build1", "build2", "build3", "build4", "build5"].map((k, i) => {
    const [name, desc, tag] = t(k).split("|");
    return { num: String(i + 1).padStart(2, "0"), name, desc, tag };
  });

  const steps = [1, 2, 3, 4].map((n) => ({
    sn: `${t("stepWord")} 0${n}`,
    title: t(`step${n}Title`),
    desc: t(`step${n}Desc`),
  }));

  const sectors = t("sectors").split("|");

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />

      <Hero
        meta={meta}
        eyebrow={t("eyebrow")}
        title={t.rich("heroTitle", {
          accent: (chunks) => (
            <span className="underline decoration-foreground/30 decoration-2 underline-offset-[6px]">
              {chunks}
            </span>
          ),
        })}
        sub={t("heroSub")}
        fig="FIG.01"
        figCaption={t("figCaption")}
        actions={
          <>
            <Link
              href="/services"
              className="font-mono bg-foreground px-6 py-3 text-xs uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-80"
            >
              {t("ctaBuild")}
            </Link>
            <Link
              href="/about"
              className="font-mono border border-border px-6 py-3 text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground/60"
            >
              {t("ctaStory")}
            </Link>
          </>
        }
      />

      {/* §01 Capabilities */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <SectionLabel index="01">{t("capLabel")}</SectionLabel>
          <DraftFlag>{t("capNote")}</DraftFlag>
        </div>
        <div className="grid gap-12 md:grid-cols-2 md:gap-0">
          <CapabilityBlock
            num={t("cap1Num")}
            title={t("cap1Title")}
            body={t("cap1Body")}
            items={t("cap1Items").split("|")}
            className="md:pe-10"
          />
          <CapabilityBlock
            num={t("cap2Num")}
            title={t("cap2Title")}
            body={t("cap2Body")}
            items={t("cap2Items").split("|")}
            className="md:border-s md:border-border md:ps-10"
          />
        </div>
      </section>

      {/* §02 What we build */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionLabel index="02" className="mb-8">{t("buildLabel")}</SectionLabel>
          <IndexTable rows={buildRows} />
        </div>
      </section>

      {/* §03 Approach */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionLabel index="03" className="mb-10">{t("approachLabel")}</SectionLabel>
        <ProcessSequence steps={steps} orientation="row" />
        <Link
          href="/approach"
          className="ins-label font-mono mt-10 inline-block text-foreground underline-offset-4 hover:underline"
        >
          {t("methodLink")} <span aria-hidden>→</span>
        </Link>
      </section>

      {/* §04 From the founder */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <SectionLabel index="04" className="mb-10">{t("founderLabel")}</SectionLabel>
          <FounderNote
            quote={tf("founderQuote")}
            name={tf("founderName")}
            role={tf("founderRole")}
            linkedinLabel={tf("founderLinkedinLabel")}
            linkedinUrl={tf("founderLinkedinUrl")}
            portraitLabel={tf("founderPortrait")}
            draftLabel={tf("founderDraft")}
          />
        </div>
      </section>

      {/* §05 Sectors */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <SectionLabel index="05">{t("sectorsLabel")}</SectionLabel>
          <DraftFlag>{t("sectorsNote")}</DraftFlag>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {sectors.map((s, i) => (
            <span key={s} className="flex items-center gap-x-6">
              <span className="font-mono text-sm uppercase tracking-[0.12em] text-foreground">
                {s}
              </span>
              {i < sectors.length - 1 && <span aria-hidden className="text-border">/</span>}
            </span>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
