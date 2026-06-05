import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { listMedia } from "@/server/media";
import { savePost } from "@/server/posts";
import { PostForm } from "@/components/admin/post-form";
import { EMPTY_DOC } from "@/lib/tiptap";
import type { JSONContent } from "@tiptap/react";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const [post, media] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    listMedia(),
  ]);
  if (!post) notFound();

  const action = savePost.bind(null, post.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <PostForm
        action={action}
        media={media}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: (post.body as JSONContent) ?? EMPTY_DOC,
          titleAr: post.titleAr,
          excerptAr: post.excerptAr,
          bodyAr: (post.bodyAr as JSONContent) ?? null,
          coverImageId: post.coverImageId,
          tags: post.tags,
          status: post.status,
        }}
      />
    </div>
  );
}
