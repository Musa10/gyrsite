"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type MediaItem = { id: string; url: string; filename: string };

export function MediaPicker({
  name,
  media,
  initialId,
}: {
  name: string;
  media: MediaItem[];
  initialId?: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(initialId ?? null);

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={selected ?? ""} />
      <div className="flex flex-wrap gap-2">
        {selected && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSelected(null)}
          >
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {media.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelected(m.id)}
            className={`overflow-hidden rounded border ${
              selected === m.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <Image
              src={m.url}
              alt={m.filename}
              width={120}
              height={80}
              className="h-16 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
