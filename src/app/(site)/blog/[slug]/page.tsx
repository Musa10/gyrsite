import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/server/public-content";
import { Prose } from "@/components/site/prose";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      {post.author && (
        <p className="text-sm text-muted-foreground">By {post.author.name}</p>
      )}
      {post.coverImage && (
        <Image
          src={post.coverImage.url}
          alt={post.coverImage.alt ?? post.title}
          width={900}
          height={500}
          className="w-full rounded object-cover"
        />
      )}
      <Prose doc={post.body} />
    </article>
  );
}
