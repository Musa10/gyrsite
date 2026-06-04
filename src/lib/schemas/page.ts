import { z } from "zod";
import { STATUSES } from "@/lib/content-types";

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  body: z.string().min(2, "Body is required"),
  status: z.enum(STATUSES),
  showInNav: z.union([z.literal("on"), z.literal("")]).optional(),
  navOrder: z.string().optional(),
});

export type PageInput = z.infer<typeof pageSchema>;
