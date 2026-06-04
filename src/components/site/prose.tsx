import { renderTiptap } from "@/lib/tiptap";

export function Prose({ doc }: { doc: unknown }) {
  const html = renderTiptap(doc);
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
