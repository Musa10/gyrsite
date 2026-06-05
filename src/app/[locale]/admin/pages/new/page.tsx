import { getTranslations } from "next-intl/server";
import { requireUser } from "@/server/session";
import { savePage } from "@/server/pages";
import { PageForm } from "@/components/admin/page-form";

export default async function NewPage() {
  await requireUser();
  const t = await getTranslations("admin");
  const action = savePage.bind(null, null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("newPage")}</h1>
      <PageForm action={action} />
    </div>
  );
}
