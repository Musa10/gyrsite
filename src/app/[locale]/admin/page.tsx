import { getTranslations } from "next-intl/server";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  await requireUser();
  const t = await getTranslations("admin");

  const [posts, pages, team, media] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.teamMember.count(),
    prisma.media.count(),
  ]);

  const stats = [
    { label: t("posts"), value: posts },
    { label: t("pages"), value: pages },
    { label: t("team"), value: team },
    { label: t("media"), value: media },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {s.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{s.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
