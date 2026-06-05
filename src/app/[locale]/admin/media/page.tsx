import Image from "next/image";
import { requireUser } from "@/server/session";
import { listMedia } from "@/server/media";
import { MediaUploader } from "@/components/admin/media-uploader";

export default async function MediaPage() {
  await requireUser();
  const media = await listMedia();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media</h1>
      </div>
      <MediaUploader />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {media.map((m) => (
          <figure key={m.id} className="overflow-hidden rounded border">
            <Image
              src={m.url}
              alt={m.alt ?? m.filename}
              width={m.width ?? 300}
              height={m.height ?? 200}
              className="h-32 w-full object-cover"
            />
            <figcaption className="truncate p-2 text-xs text-muted-foreground">
              {m.filename}
            </figcaption>
          </figure>
        ))}
        {media.length === 0 && (
          <p className="text-sm text-muted-foreground">No media yet.</p>
        )}
      </div>
    </div>
  );
}
