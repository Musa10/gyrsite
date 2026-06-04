export const STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type ContentStatus = (typeof STATUSES)[number];
