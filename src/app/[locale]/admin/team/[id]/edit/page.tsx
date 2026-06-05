import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { listMedia } from "@/server/media";
import { saveTeamMember } from "@/server/team";
import { TeamForm } from "@/components/admin/team-form";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const t = await getTranslations("admin");
  const { id } = await params;
  const [member, media] = await Promise.all([
    prisma.teamMember.findUnique({ where: { id } }),
    listMedia(),
  ]);
  if (!member) notFound();

  const socials =
    (member.socials as {
      twitter?: string | null;
      linkedin?: string | null;
      github?: string | null;
    }) ?? {};
  const action = saveTeamMember.bind(null, member.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("editMember")}</h1>
      <TeamForm
        action={action}
        media={media}
        initial={{
          name: member.name,
          role: member.role,
          bio: member.bio,
          roleAr: member.roleAr,
          bioAr: member.bioAr,
          photoId: member.photoId,
          socials,
          order: member.order,
          status: member.status,
        }}
      />
    </div>
  );
}
