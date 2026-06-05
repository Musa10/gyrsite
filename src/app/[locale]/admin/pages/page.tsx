import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { deletePage } from "@/server/pages";
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

export default async function PagesPage() {
  await requireUser();
  const t = await getTranslations("admin");
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("pages")}</h1>
        <Button asChild>
          <Link href="/admin/pages/new">{t("newPage")}</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("colTitle")}</TableHead>
            <TableHead>{t("colSlug")}</TableHead>
            <TableHead>{t("colStatus")}</TableHead>
            <TableHead className="text-right">{t("colActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {p.title}
                {p.customLayout && (
                  <Badge variant="secondary" className="ml-2">
                    {t("coded")}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">/{p.slug}</TableCell>
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
                  <Link href={`/admin/pages/${p.id}/edit`}>{t("edit")}</Link>
                </Button>
                <DeleteButton action={deletePage} id={p.id} />
              </TableCell>
            </TableRow>
          ))}
          {pages.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                {t("noPages")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
