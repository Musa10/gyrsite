import { getTranslations } from "next-intl/server";
import { MediaPicker } from "@/components/admin/media-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type MediaItem = { id: string; url: string; filename: string };

export async function TeamForm({
  action,
  media,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  media: MediaItem[];
  initial?: {
    name: string;
    role: string;
    bio: string | null;
    roleAr: string | null;
    bioAr: string | null;
    photoId: string | null;
    socials: {
      twitter?: string | null;
      linkedin?: string | null;
      github?: string | null;
    };
    order: number;
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  const t = await getTranslations("admin");
  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initial?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">{t("roleEn")}</Label>
        <Input id="role" name="role" defaultValue={initial?.role} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleAr">{t("roleAr")}</Label>
        <Input
          id="roleAr"
          name="roleAr"
          dir="rtl"
          defaultValue={initial?.roleAr ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">{t("bioEn")}</Label>
        <Textarea id="bio" name="bio" defaultValue={initial?.bio ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bioAr">{t("bioAr")}</Label>
        <Textarea
          id="bioAr"
          name="bioAr"
          dir="rtl"
          defaultValue={initial?.bioAr ?? ""}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            name="twitter"
            defaultValue={initial?.socials.twitter ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            name="linkedin"
            defaultValue={initial?.socials.linkedin ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            name="github"
            defaultValue={initial?.socials.github ?? ""}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Photo</Label>
        <MediaPicker name="photoId" media={media} initialId={initial?.photoId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={initial?.order ?? 0}
          className="w-32"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={initial?.status ?? "DRAFT"}
          className="block w-40 rounded-md border p-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <Button type="submit">{t("save")}</Button>
    </form>
  );
}
