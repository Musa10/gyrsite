import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedPosts } from "@/server/public-content";
import { Hero } from "@/components/site/hero";
import { TrustStrip } from "@/components/site/trust-strip";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactCta } from "@/components/site/contact-cta";
import { FalconMark } from "@/components/site/brand/falcon";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const posts = (await getPublishedPosts(locale)).slice(0, 3);

  // Arabic brand words shown as a muted accent on the EN locale only (on AR the
  // card title is already Arabic, so the accent would be redundant).
  const capabilities = [
    { ar: "ذكاء", title: t("cap1Title"), desc: t("cap1Desc") },
    { ar: "أتمتة", title: t("cap2Title"), desc: t("cap2Desc") },
    { ar: "ضمان", title: t("cap3Title"), desc: t("cap3Desc") },
  ];
  const pillars = [
    { ar: "اتصال ذكي", title: t("pillar1Title"), desc: t("pillar1Desc") },
    { ar: "إبتكار مستمر", title: t("pillar2Title"), desc: t("pillar2Desc") },
    { ar: "تقدم دائم", title: t("pillar3Title"), desc: t("pillar3Desc") },
  ];

  return (
    <>
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

      <TrustStrip label={t("trustLabel")} />

      {/* Capabilities */}
      <section
        id="capabilities"
        className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6"
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
              className="brand-card rounded-xl p-7"
              style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}
            >
              {locale === "en" && (
                <p dir="rtl" className="font-arabic mb-1 text-sm text-muted-foreground">
                  {c.ar}
                </p>
              )}
              <h3 className="mb-2 text-lg font-medium">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {c.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
              className="brand-card rounded-xl p-7"
              style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}
            >
              {locale === "en" && (
                <p dir="rtl" className="font-arabic mb-1 text-sm text-muted-foreground">
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

      {/* Latest insights */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
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
          <div className="brand-card rounded-xl p-12 text-center text-muted-foreground">
            {t("insightsEmpty")}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="brand-card group flex flex-col overflow-hidden rounded-xl"
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
                    <FalconMark className="h-14 w-auto text-foreground/40" />
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
