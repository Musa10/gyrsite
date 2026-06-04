import { notFound } from "next/navigation";
import { getPageBySlug } from "@/server/public-content";
import { RESERVED_SLUGS } from "@/lib/slugify";
import { Prose } from "@/components/site/prose";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const joined = slug.join("/");

  // Reserved prefixes are handled by their own routes; never resolve here.
  if (RESERVED_SLUGS.has(slug[0])) notFound();

  const page = await getPageBySlug(joined);
  if (!page) notFound();

  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">{page.title}</h1>
      <Prose doc={page.body} />
    </article>
  );
}
