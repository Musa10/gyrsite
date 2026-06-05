"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { JSONContent } from "@tiptap/react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { EMPTY_DOC } from "@/lib/tiptap";
import { Label } from "@/components/ui/label";

export function PageBodyField({
  initialContent,
  initialContentAr,
  initialCustomLayout,
}: {
  initialContent?: JSONContent;
  initialContentAr?: JSONContent;
  initialCustomLayout?: boolean;
}) {
  const t = useTranslations("admin");
  const [customLayout, setCustomLayout] = useState(
    initialCustomLayout ?? false
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          id="customLayout"
          name="customLayout"
          type="checkbox"
          checked={customLayout}
          onChange={(e) => setCustomLayout(e.target.checked)}
        />
        <Label htmlFor="customLayout">
          Custom-coded layout (no body editor)
        </Label>
      </div>

      {customLayout ? (
        <>
          <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            This page&apos;s layout is coded in React at{" "}
            <code className="font-mono">/&lt;slug&gt;</code>. This record only
            controls its title, nav label, order, and visibility.
          </p>
          <input type="hidden" name="body" value={JSON.stringify(EMPTY_DOC)} />
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label>{t("bodyEn")}</Label>
            <RichTextEditor name="body" initialContent={initialContent} />
          </div>
          <div className="space-y-2">
            <Label>{t("bodyAr")}</Label>
            <RichTextEditor
              name="bodyAr"
              initialContent={initialContentAr}
              dir="rtl"
            />
          </div>
        </>
      )}
    </div>
  );
}
