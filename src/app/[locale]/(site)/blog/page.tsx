import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedPosts } from "@/server/public-content";
import { PageHeader } from "@/components/site/page-header";
import { FalconMark } from "@/components/site/brand/falcon";
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
    path: "/blog",
    title: t("blogTitle"),
    description: t("blogDescription"),
  });
}

export default async function BlogIndex() {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const posts = await getPublishedPosts(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader eyebrow={t("eyebrow")} title={t("heading")}>
        {t("lead")}
      </PageHeader>

      {posts.length === 0 ? (
        <div className="brand-card rounded-lg p-12 text-center text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="brand-card group flex flex-col overflow-hidden rounded-lg"
              style={{ animation: `fade-up 0.5s ${Math.min(i * 0.06, 0.4)}s both` }}
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
                {p.author && (
                  <p className="font-display mb-2 text-[0.65rem] tracking-[0.16em] text-muted-foreground">
                    {p.author.name.toUpperCase()}
                  </p>
                )}
                <h2 className="mb-2 text-lg font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                  {p.title}
                </h2>
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
    </div>
  );
}
