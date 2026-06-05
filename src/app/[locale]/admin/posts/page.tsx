import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { deletePost } from "@/server/posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PostsPage() {
  await requireUser();
  const t = await getTranslations("admin");
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("posts")}</h1>
        <Button asChild>
          <Link href="/admin/posts/new">{t("newPost")}</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("colTitle")}</TableHead>
            <TableHead>{t("colStatus")}</TableHead>
            <TableHead className="text-right">{t("colActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.title}</TableCell>
              <TableCell>
                <Badge
                  variant={p.status === "PUBLISHED" ? "default" : "secondary"}
                >
                  {p.status === "PUBLISHED"
                    ? t("statusPublished")
                    : t("statusDraft")}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/posts/${p.id}/edit`}>{t("edit")}</Link>
                </Button>
                <DeleteButton action={deletePost} id={p.id} />
              </TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">
                {t("noPosts")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
