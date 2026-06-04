import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/server/public-content";

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog</h1>
      {posts.length === 0 && (
        <p className="text-muted-foreground">No posts yet.</p>
      )}
      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.id} className="flex gap-4">
            {p.coverImage && (
              <Image
                src={p.coverImage.url}
                alt={p.coverImage.alt ?? p.title}
                width={160}
                height={100}
                className="h-24 w-40 rounded object-cover"
              />
            )}
            <div>
              <Link
                href={`/blog/${p.slug}`}
                className="text-xl font-semibold hover:underline"
              >
                {p.title}
              </Link>
              {p.excerpt && (
                <p className="text-muted-foreground">{p.excerpt}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
