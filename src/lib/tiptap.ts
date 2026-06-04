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

export function renderTiptap(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  return generateHTML(doc as JSONContent, tiptapExtensions);
}
