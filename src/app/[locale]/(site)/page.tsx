import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedPosts } from "@/server/public-content";
import { Hero } from "@/components/site/hero";
import { TrustStrip } from "@/components/site/trust-strip";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactCta } from "@/components/site/contact-cta";
import { FalconMark } from "@/components/site/brand/falcon";
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

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const posts = (await getPublishedPosts(locale)).slice(0, 3);
  const trustItems = [t("trust1"), t("trust2"), t("trust3"), t("trust4")];

  const capabilities = [
    { title: t("cap1Title"), desc: t("cap1Desc") },
    { title: t("cap2Title"), desc: t("cap2Desc") },
    { title: t("cap3Title"), desc: t("cap3Desc") },
  ];
  const pillars = [
    { title: t("pillar1Title"), desc: t("pillar1Desc") },
    { title: t("pillar2Title"), desc: t("pillar2Desc") },
    { title: t("pillar3Title"), desc: t("pillar3Desc") },
  ];
  const services = [
    { title: t("service1Title"), desc: t("service1Desc") },
    { title: t("service2Title"), desc: t("service2Desc") },
    { title: t("service3Title"), desc: t("service3Desc") },
    { title: t("service4Title"), desc: t("service4Desc") },
  ];
  const delivery = [
    { title: t("delivery1Title"), desc: t("delivery1Desc") },
    { title: t("delivery2Title"), desc: t("delivery2Desc") },
    { title: t("delivery3Title"), desc: t("delivery3Desc") },
    { title: t("delivery4Title"), desc: t("delivery4Desc") },
  ];

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />
      <Hero
        eyebrow={t("eyebrow")}
        title={t.rich("heroTitle", {
          accent: (chunks) => (
            <span className="font-medium text-foreground">{chunks}</span>
          ),
        })}
        sub={t("heroSub")}
        actions={
          <>
            <a
              href="#capabilities"
              className="font-display rounded-md bg-foreground px-6 py-3 text-xs tracking-[0.16em] text-background transition-opacity hover:opacity-80"
            >
              {t("ctaBuild")}
            </a>
            <Link
              href="/about"
              className="font-display rounded-md border border-border px-6 py-3 text-xs tracking-[0.16em] text-foreground transition-colors hover:border-foreground/60"
            >
              {t("ctaStory")}
            </Link>
          </>
        }
      />

      <TrustStrip label={t("trustLabel")} items={trustItems} />

      {/* Capabilities */}
      <section
        id="capabilities"
        className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <SectionHeading
          eyebrow={t("capEyebrow")}
          title={t("capHeading")}
          intro={t("capIntro")}
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((c, i) => (
            <article
              key={c.title}
              className="brand-card rounded-lg p-7"
              style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}
            >
              <span className="font-display text-[0.68rem] tracking-[0.16em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2 mt-4 text-lg font-medium">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {c.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Core services */}
      <section className="border-y border-border/60 bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow={t("servicesEyebrow")}
            title={t("servicesHeading")}
            intro={t("servicesIntro")}
            className="mb-12"
          />
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            {services.map((service, i) => (
              <article
                key={service.title}
                className="bg-background p-7"
                style={{ animation: `fade-up 0.6s ${i * 0.08}s both` }}
              >
                <span className="font-display text-[0.68rem] tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-medium">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery model */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow={t("deliveryEyebrow")}
            title={t("deliveryHeading")}
            intro={t("deliveryIntro")}
          />
          <div className="space-y-4">
            {delivery.map((step, i) => (
              <article
                key={step.title}
                className="grid gap-4 border-t border-border py-5 sm:grid-cols-[4rem_1fr]"
                style={{ animation: `fade-up 0.6s ${i * 0.08}s both` }}
              >
                <span className="font-display text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <SectionHeading
          eyebrow={t("pillarsEyebrow")}
          title={t("pillarsHeading")}
          intro={t("pillarsIntro")}
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

      {/* Latest insights */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <SectionHeading
            eyebrow={t("insightsEyebrow")}
            title={t("insightsHeading")}
          />
          <Link
            href="/blog"
            className="font-display hidden text-xs tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            {t("insightsAll")}
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="brand-card rounded-lg p-12 text-center text-muted-foreground">
            {t("insightsEmpty")}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="brand-card group flex flex-col overflow-hidden rounded-lg"
              >
                {p.coverImage ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.coverImage.url}
                      alt={p.coverImage.alt ?? p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="bg-grid flex aspect-[16/10] items-center justify-center bg-secondary/40">
                    <FalconMark className="h-10 w-auto text-foreground/40" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-lg font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <ContactCta />
    </>
  );
}
