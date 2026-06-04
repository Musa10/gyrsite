import { z } from "zod";
import { STATUSES } from "@/lib/content-types";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  body: z.string().min(2, "Body is required"), // JSON string from the editor
  coverImageId: z.string().optional().nullable(),
  tags: z.string().optional(), // comma-separated in the form
  status: z.enum(STATUSES),
});

export type PostInput = z.infer<typeof postSchema>;
