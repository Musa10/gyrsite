"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { useState } from "react";
import { tiptapExtensions, EMPTY_DOC } from "@/lib/tiptap";
import { Button } from "@/components/ui/button";

export function RichTextEditor({
  name,
  initialContent,
  dir = "ltr",
}: {
  name: string;
  initialContent?: JSONContent;
  dir?: "ltr" | "rtl";
}) {
  const [json, setJson] = useState<JSONContent>(initialContent ?? EMPTY_DOC);

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: json,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[240px] rounded-md border p-3 focus:outline-none",
        dir,
      },
    },
    onUpdate: ({ editor }) => setJson(editor.getJSON()),
  });

  return (
    <div className="space-y-2">
      {editor && (
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            List
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={JSON.stringify(json)} />
    </div>
  );
}
