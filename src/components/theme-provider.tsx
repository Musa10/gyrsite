"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App-wide theme provider. `attribute="class"` makes next-themes set
 * `class="light"` / `class="dark"` on <html>; our CSS keys off `.light`
 * (`.dark` is a no-op because :root is already the dark palette).
 * `defaultTheme="system"` + `enableSystem` = follow the OS until the user
 * picks; the choice is then persisted in localStorage and wins on return.
 * `disableTransitionOnChange` prevents a color-fade flash when switching.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
