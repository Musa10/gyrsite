import { PageBodyField } from "@/components/admin/page-body-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { JSONContent } from "@tiptap/react";

export function PageForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title: string;
    slug: string;
    body: JSONContent;
    status: "DRAFT" | "PUBLISHED";
    showInNav: boolean;
    navOrder: number;
    customLayout: boolean;
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
      <PageBodyField
        initialContent={initial?.body}
        initialCustomLayout={initial?.customLayout}
      />
      <div className="flex items-center gap-2">
        <input
          id="showInNav"
          name="showInNav"
          type="checkbox"
          defaultChecked={initial?.showInNav}
        />
        <Label htmlFor="showInNav">Show in navigation</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="navOrder">Nav order</Label>
        <Input
          id="navOrder"
          name="navOrder"
          type="number"
          defaultValue={initial?.navOrder ?? 0}
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
      <Button type="submit">Save</Button>
    </form>
  );
}
