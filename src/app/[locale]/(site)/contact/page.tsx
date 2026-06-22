import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { SectionLabel } from "@/components/site/instrument/section-label";
import { ContactPanel } from "@/components/site/contact-panel";
import { JsonLd } from "@/components/site/json-ld";
import { createMetadata, breadcrumbJsonLd, siteConfig } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return createMetadata({
    locale,
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tf = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const ts = await getTranslations("seo");

  const guides = [t("guide1"), t("guide2"), t("guide3")];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tn("home"), path: "/" },
          { name: ts("contactTitle"), path: "/contact" },
        ])}
      />

      <Hero
        variant="lite"
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
      />

      {/* §01 Direct channel */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionLabel index="01" className="mb-10">{t("directLabel")}</SectionLabel>
        <ContactPanel
          email={siteConfig.email}
          subject={t("subject")}
          ctaLabel={t("cta")}
          founderLine={t("founderLine")}
        />
      </section>

      {/* §02 What to include */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionLabel index="02" className="mb-8">{t("guideLabel")}</SectionLabel>
          <ol className="max-w-2xl">
            {guides.map((g, i) => (
              <li
                key={g}
                className="grid grid-cols-[2.5rem_1fr] items-baseline gap-4 border-t border-border py-4"
              >
                <span className="ins-label font-mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-base leading-relaxed text-foreground">{g}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* §03 Details */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionLabel index="03" className="mb-8">{t("detailsLabel")}</SectionLabel>
        <ul className="space-y-2 font-mono text-sm text-muted-foreground">
          <li>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
              {siteConfig.email}
            </a>
          </li>
          <li>{tf("location")}</li>
          <li>{tf("linkedin")}</li>
        </ul>
      </section>
    </>
  );
}
