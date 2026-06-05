import { z } from "zod";
import { STATUSES } from "@/lib/content-types";

export const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional(),
  roleAr: z.string().optional(),
  bioAr: z.string().optional(),
  photoId: z.string().optional().nullable(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  order: z.string().optional(),
  status: z.enum(STATUSES),
});

export type TeamInput = z.infer<typeof teamSchema>;
