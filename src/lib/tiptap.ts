import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/react";

export const tiptapExtensions = [
  StarterKit,
  Link.configure({ openOnClick: false }),
];

export const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

/**
 * True when a Tiptap doc has no meaningful text — e.g. a freshly-initialized
 * editor (`EMPTY_DOC`) or a doc of empty paragraphs. Used to persist an empty
 * Arabic body as SQL NULL so the English fallback applies instead of rendering
 * a blank document.
 */
export function isEmptyDoc(doc: unknown): boolean {
  if (!doc || typeof doc !== "object") return true;
  const hasText = (node: JSONContent): boolean => {
    if (node.type === "text" && typeof node.text === "string" && node.text.trim() !== "")
      return true;
    return Array.isArray(node.content) ? node.content.some(hasText) : false;
  };
  return !hasText(doc as JSONContent);
}

export function renderTiptap(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  return generateHTML(doc as JSONContent, tiptapExtensions);
}
