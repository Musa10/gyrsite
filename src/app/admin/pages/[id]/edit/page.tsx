import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { prisma } from "@/db/prisma";
import { savePage } from "@/server/pages";
import { PageForm } from "@/components/admin/page-form";
import { EMPTY_DOC } from "@/lib/tiptap";
import type { JSONContent } from "@tiptap/react";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const action = savePage.bind(null, page.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit page</h1>
      <PageForm
        action={action}
        initial={{
          title: page.title,
          slug: page.slug,
          body: (page.body as JSONContent) ?? EMPTY_DOC,
          status: page.status,
          showInNav: page.showInNav,
          navOrder: page.navOrder,
        }}
      />
    </div>
  );
}
