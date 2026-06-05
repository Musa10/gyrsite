import { requireUser } from "@/server/session";
import { savePage } from "@/server/pages";
import { PageForm } from "@/components/admin/page-form";

export default async function NewPage() {
  await requireUser();
  const action = savePage.bind(null, null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New page</h1>
      <PageForm action={action} />
    </div>
  );
}
