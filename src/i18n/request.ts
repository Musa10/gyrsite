import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../../messages/en.json";

type Messages = typeof en;

// Deep-merge locale messages over the English base so any missing key
// falls back to English rather than rendering the raw key.
function deepMerge<T>(base: T, override: Partial<T>): T {
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override as object)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    out[key] =
      b && o && typeof b === "object" && typeof o === "object"
        ? deepMerge(b, o as object)
        : o;
  }
  return out as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages =
    locale === routing.defaultLocale
      ? en
      : deepMerge(
          en,
          (await import(`../../messages/${locale}.json`)).default as Partial<Messages>,
        );

  return { locale, messages };
});
