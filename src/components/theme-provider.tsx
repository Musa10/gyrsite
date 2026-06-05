"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * App-wide theme provider. `attribute="class"` makes next-themes set
 * `class="light"` / `class="dark"` on <html>; our CSS uses `:root` for the
 * light palette and `.dark` to override it (the `light` class is a no-op).
 * `defaultTheme="light"` makes light the baseline; `enableSystem` still lets a
 * first-time visitor follow a dark OS until they pick. The choice persists in
 * localStorage. `disableTransitionOnChange` prevents a color-fade flash.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
