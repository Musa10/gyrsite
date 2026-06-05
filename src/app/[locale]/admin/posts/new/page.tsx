import { getTranslations } from "next-intl/server";
import { requireUser } from "@/server/session";
import { listMedia } from "@/server/media";
import { savePost } from "@/server/posts";
import { PostForm } from "@/components/admin/post-form";

export default async function NewPostPage() {
  await requireUser();
  const t = await getTranslations("admin");
  const media = await listMedia();
  const action = savePost.bind(null, null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("newPost")}</h1>
      <PostForm action={action} media={media} />
    </div>
  );
}
