import { notFound } from "next/navigation";
import { getPageBySlug } from "@/server/public-content";
import { RESERVED_SLUGS } from "@/lib/slugify";
import { Prose } from "@/components/site/prose";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>;
}) {
  const { slug, locale } = await params;
  const page = await getPageBySlug(slug.join("/"), locale);
  return { title: page?.title ?? "Page" };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>;
}) {
  const { slug, locale } = await params;
  const joined = slug.join("/");

  // Reserved prefixes are handled by their own routes; never resolve here.
  if (RESERVED_SLUGS.has(slug[0])) notFound();

  const page = await getPageBySlug(joined, locale);
  if (!page) notFound();
  // Coded pages own their path via an explicit React route; never render their
  // (empty) body through the document renderer. 404 until the coded route exists.
  if (page.customLayout) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 [animation:fade-up_0.6s_both]">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {page.title}
      </h1>
      <div className="mt-8 rule" />
      <div className="mt-10" dir={locale === "ar" ? "rtl" : "ltr"}>
        <Prose doc={page.body} />
      </div>
    </article>
  );
}
