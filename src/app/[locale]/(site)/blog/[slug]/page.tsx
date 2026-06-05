import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPostBySlug } from "@/server/public-content";
import { Prose } from "@/components/site/prose";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getPostBySlug(slug, locale);
  return {
    title: post?.title ?? "Insight",
    description: post?.excerpt ?? undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations("blog");
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 [animation:fade-up_0.6s_both]">
      <Link
        href="/blog"
        className="font-brand mb-8 inline-block text-[0.7rem] tracking-[0.2em] text-muted-foreground transition-colors hover:text-sky"
      >
        {t("all")}
      </Link>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {post.title}
      </h1>

      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        {post.author && <span>{t("by")} {post.author.name}</span>}
        {post.publishedAt && (
          <>
            <span className="text-border">·</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </>
        )}
      </div>

      <div className="mt-8 rule-glow" />

      {post.coverImage && (
        <Image
          src={post.coverImage.url}
          alt={post.coverImage.alt ?? post.title}
          width={900}
          height={500}
          className="mt-8 w-full rounded-xl border border-border/60 object-cover"
        />
      )}

      <div className="mt-10" dir={locale === "ar" ? "rtl" : "ltr"}>
        <Prose doc={post.body} />
      </div>
    </article>
  );
}
