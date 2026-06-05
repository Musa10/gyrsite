import type { Locale } from "@/i18n/routing";

/**
 * Resolve a localized value: returns the Arabic value when the locale is `ar`
 * and the Arabic value is "present", otherwise the English/default value.
 *
 * "Present" means: non-null, and — for strings — non-empty after trimming.
 * Non-string values (e.g. Tiptap JSON) count as present when not null/undefined.
 */
export function pickLocalized<T>(en: T, ar: T | null | undefined, locale: Locale | string): T {
  if (locale !== "ar") return en;
  if (ar === null || ar === undefined) return en;
  if (typeof ar === "string" && ar.trim() === "") return en;
  return ar;
}
