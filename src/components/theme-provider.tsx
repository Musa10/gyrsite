"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * App-wide theme provider. `attribute="class"` makes next-themes set
 * `class="light"` / `class="dark"` on <html>; our CSS keys off `.light`
 * (`.dark` is a no-op because :root is already the dark palette).
 * `defaultTheme="system"` + `enableSystem` = follow the OS until the user
 * picks; the choice is then persisted in localStorage and wins on return.
 * `disableTransitionOnChange` prevents a color-fade flash when switching.
 *
 * The configured props are project-wide defaults; callers may override any of
 * them (the spread wins), keeping this wrapper as the single theme entry point.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
