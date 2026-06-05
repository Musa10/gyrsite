import { getTranslations } from "next-intl/server";
import { requireUser } from "@/server/session";
import { listMedia } from "@/server/media";
import { saveTeamMember } from "@/server/team";
import { TeamForm } from "@/components/admin/team-form";

export default async function NewTeamMemberPage() {
  await requireUser();
  const t = await getTranslations("admin");
  const media = await listMedia();
  const action = saveTeamMember.bind(null, null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("newMember")}</h1>
      <TeamForm action={action} media={media} />
    </div>
  );
}
