import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { deleteTeamMember } from "@/server/team";
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

export default async function TeamPage() {
  await requireUser();
  const t = await getTranslations("admin");
  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("team")}</h1>
        <Button asChild>
          <Link href="/admin/team/new">{t("newMember")}</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("colName")}</TableHead>
            <TableHead>{t("colRole")}</TableHead>
            <TableHead>{t("colStatus")}</TableHead>
            <TableHead className="text-right">{t("colActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell className="text-muted-foreground">{m.role}</TableCell>
              <TableCell>
                <Badge
                  variant={m.status === "PUBLISHED" ? "default" : "secondary"}
                >
                  {m.status === "PUBLISHED"
                    ? t("statusPublished")
                    : t("statusDraft")}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/team/${m.id}/edit`}>{t("edit")}</Link>
                </Button>
                <DeleteButton action={deleteTeamMember} id={m.id} />
              </TableCell>
            </TableRow>
          ))}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                {t("noTeam")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
