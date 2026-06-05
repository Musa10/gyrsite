"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Upload failed");
      return;
    }
    e.target.value = "";
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Input type="file" accept="image/*" disabled={busy} onChange={onChange} />
      {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
