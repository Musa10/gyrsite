"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireUser } from "@/server/session";
import { teamSchema } from "@/lib/schemas/team";

export async function saveTeamMember(id: string | null, formData: FormData) {
  await requireUser();

  const parsed = teamSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid team member");
  }
  const d = parsed.data;

  const data = {
    name: d.name,
    role: d.role,
    bio: d.bio || null,
    photoId: d.photoId || null,
    socials: {
      twitter: d.twitter || null,
      linkedin: d.linkedin || null,
      github: d.github || null,
    },
    order: d.order ? parseInt(d.order, 10) || 0 : 0,
    status: d.status,
  };

  if (id) {
    await prisma.teamMember.update({ where: { id }, data });
  } else {
    await prisma.teamMember.create({ data });
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await requireUser();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}
