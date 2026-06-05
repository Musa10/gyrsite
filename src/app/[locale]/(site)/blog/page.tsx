import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/server/public-content";
import { PageHeader } from "@/components/site/page-header";
import { Falcon } from "@/components/site/brand/falcon";

export const metadata = { title: "Insights" };

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <PageHeader eyebrow="FROM THE TEAM" title="Insights" arabic="رؤى">
        Engineering notes, product thinking, and field reports from the GYR team.
      </PageHeader>

      {posts.length === 0 ? (
        <div className="brand-card rounded-xl p-12 text-center text-muted-foreground">
          No insights published yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="brand-card group flex flex-col overflow-hidden rounded-xl"
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
                  <Falcon className="h-14 w-auto opacity-40" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {p.author && (
                  <p className="font-brand mb-2 text-[0.65rem] tracking-[0.2em] text-sky/80">
                    {p.author.name.toUpperCase()}
                  </p>
                )}
                <h2 className="mb-2 text-lg font-semibold transition-colors group-hover:text-sky">
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
