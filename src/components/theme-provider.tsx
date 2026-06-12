"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "light";
  } catch {
    return "light";
  }
}

function resolveTheme(theme: Theme): Resolved {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

function writeClass(resolved: Resolved) {
  const el = document.documentElement;
  el.classList.toggle("dark", resolved === "dark");
  el.style.colorScheme = resolved;
}

// Briefly suppress CSS transitions while the theme flips so colors snap instead
// of sweeping (equivalent to next-themes' disableTransitionOnChange).
function writeClassNoTransition(resolved: Resolved) {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none!important}"),
  );
  document.head.appendChild(style);
  writeClass(resolved);
  // Force a reflow to flush the disabling style, then re-enable transitions.
  window.getComputedStyle(document.body);
  setTimeout(() => document.head.removeChild(style), 1);
}

/**
 * App-wide theme provider — light default, toggling a `.dark` class on <html>.
 *
 * The pre-paint class is set by the inline script in the server layout
 * (`src/app/[locale]/layout.tsx`), so there is no flash AND no <script> rendered
 * by a client component (which React 19 warns about). This provider only owns
 * the React state + toggle and re-applies the class on change. `useTheme()`
 * exposes the small slice of the old next-themes API the app relied on.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<Resolved>(() =>
    typeof window === "undefined" ? "light" : resolveTheme(getStoredTheme()),
  );

  const apply = useCallback((next: Theme, snap = false) => {
    const resolved = resolveTheme(next);
    setResolvedTheme(resolved);
    if (snap) writeClassNoTransition(resolved);
    else writeClass(resolved);
  }, []);

  // Re-apply on mount and keep "system" in sync with the OS preference.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (theme !== "system") return;
      const resolved = resolveTheme("system");
      setResolvedTheme(resolved);
      writeClass(resolved);
    };
    writeClass(resolveTheme(theme));
    mql.addEventListener("change", onSystemChange);
    return () => mql.removeEventListener("change", onSystemChange);
  }, [theme]);

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setThemeState(getStoredTheme());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore (private mode / storage disabled)
      }
      apply(next, true);
      setThemeState(next);
    },
    [apply],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
