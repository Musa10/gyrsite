"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("switcher");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const target = locale === "ar" ? "en" : "ar";
  const label = target === "ar" ? t("toArabic") : t("toEnglish");

  function switchLocale() {
    startTransition(() => {
      // `pathname` from @/i18n/navigation is locale-agnostic; the router
      // applies the new locale prefix and keeps the current path.
      router.replace(pathname, { locale: target });
    });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={t("label")}
      disabled={isPending}
      className="font-display rounded-md border border-border/80 px-3 py-1.5 text-[0.7rem] tracking-[0.16em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:opacity-50"
    >
      {label}
    </button>
  );
}
