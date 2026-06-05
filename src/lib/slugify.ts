export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Slugs the public catch-all must never claim.
export const RESERVED_SLUGS = new Set(["admin", "api", "blog", "team", "about", ""]);
