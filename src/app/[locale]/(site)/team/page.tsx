import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getPublishedTeam } from "@/server/public-content";
import { PageHeader } from "@/components/site/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return { title: t("heading") };
}

export default async function TeamPage() {
  const locale = await getLocale();
  const t = await getTranslations("team");
  const team = await getPublishedTeam(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("heading")}
        arabic={locale === "en" ? "الفريق" : undefined}
      >
        {t("lead")}
      </PageHeader>

      {team.length === 0 ? (
        <div className="brand-card rounded-xl p-12 text-center text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <article
              key={m.id}
              className="brand-card group flex flex-col items-center rounded-xl p-8 text-center"
              style={{ animation: `fade-up 0.5s ${Math.min(i * 0.06, 0.4)}s both` }}
            >
              <div className="relative mb-5">
                <div
                  aria-hidden
                  className="absolute -inset-1 rounded-full bg-gradient-to-br from-teal to-sky opacity-0 blur transition-opacity duration-300 group-hover:opacity-70"
                />
                {m.photo ? (
                  <Image
                    src={m.photo.url}
                    alt={m.photo.alt ?? m.name}
                    width={144}
                    height={144}
                    className="relative h-36 w-36 rounded-full border border-border/60 object-cover"
                  />
                ) : (
                  <div className="bg-grid relative flex h-36 w-36 items-center justify-center rounded-full border border-border/60 bg-secondary/40 font-brand text-2xl tracking-widest text-sky">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold">{m.name}</h2>
              <p className="font-brand mt-1 text-[0.7rem] tracking-[0.2em] text-sky">
                {locale === "ar" ? m.role : m.role.toUpperCase()}
              </p>
              {m.bio && (
                <p
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  className="mt-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {m.bio}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
