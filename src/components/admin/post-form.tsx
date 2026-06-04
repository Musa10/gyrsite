import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { JSONContent } from "@tiptap/react";

type MediaItem = { id: string; url: string; filename: string };

export function PostForm({
  action,
  media,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  media: MediaItem[];
  initial?: {
    title: string;
    slug: string;
    excerpt: string | null;
    body: JSONContent;
    coverImageId: string | null;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={initial?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (optional — derived from title)</Label>
        <Input id="slug" name="slug" defaultValue={initial?.slug} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={initial?.excerpt ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label>Body</Label>
        <RichTextEditor name="body" initialContent={initial?.body} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" defaultValue={initial?.tags.join(", ")} />
      </div>
      <div className="space-y-2">
        <Label>Cover image</Label>
        <MediaPicker
          name="coverImageId"
          media={media}
          initialId={initial?.coverImageId}
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
      <Button type="submit">Save</Button>
    </form>
  );
}
