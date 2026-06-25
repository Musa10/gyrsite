import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { Section } from "@/components/site/kit/section";
import { Eyebrow } from "@/components/site/kit/eyebrow";
import { CapabilityRow } from "@/components/site/kit/capability-row";
import { Statement } from "@/components/site/kit/statement";
import { ProcessSequence } from "@/components/site/kit/process-sequence";
import { Reveal } from "@/components/site/kit/reveal";
import { btnPrimary, btnGhost } from "@/components/site/kit/button";
import { FounderNote } from "@/components/site/founder-note";
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

  const caps = [
    { index: "01", title: t("cap1Title"), body: t("cap1Body"), items: t("cap1Items").split("|") },
    { index: "02", title: t("cap2Title"), body: t("cap2Body"), items: t("cap2Items").split("|") },
    { index: "03", title: t("cap3Title"), body: t("cap3Body"), items: t("cap3Items").split("|") },
  ];

  const steps = [1, 2, 3, 4].map((n) => ({
    n: `0${n}`,
    title: t(`step${n}Title`),
    body: t(`step${n}Desc`),
  }));

  const accent = (chunks: React.ReactNode) => (
    <strong className="font-medium text-foreground">{chunks}</strong>
  );

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />

      <Hero
        variant="full"
        eyebrow={t("eyebrow")}
        title={t.rich("heroTitle", { accent })}
        sub={t("heroSub")}
        actions={
          <>
            <a href="#capabilities" className={btnPrimary}>
              {t("ctaBuild")}
            </a>
            <a href="#about" className={btnGhost}>
              {t("ctaStory")} <span aria-hidden>→</span>
            </a>
          </>
        }
      />

      <Section id="capabilities" divider={false}>
        <Reveal>
          <Eyebrow>{t("capLabel")}</Eyebrow>
          <div className="mt-8">
            {caps.map((c) => (
              <CapabilityRow
                key={c.index}
                index={c.index}
                title={c.title}
                body={c.body}
                items={c.items}
              />
            ))}
          </div>
        </Reveal>
      </Section>

      <Section surface>
        <Reveal>
          <Statement>{t.rich("statement", { accent })}</Statement>
        </Reveal>
      </Section>

      <Section id="approach">
        <Reveal>
          <Eyebrow>{t("approachLabel")}</Eyebrow>
          <div className="mt-8">
            <ProcessSequence steps={steps} />
          </div>
        </Reveal>
      </Section>

      <Section id="about" surface>
        <Reveal>
          <Eyebrow>{t("founderLabel")}</Eyebrow>
          <div className="mt-10">
            <FounderNote
              quote={tf("founderQuote")}
              name={tf("founderName")}
              role={tf("founderRole")}
              linkedinLabel={tf("founderLinkedinLabel")}
              linkedinUrl={tf("founderLinkedinUrl")}
              portraitLabel={tf("founderPortrait")}
            />
          </div>
        </Reveal>
      </Section>

      <ContactCta />
    </>
  );
}
