import { create } from "zustand";

type ThemeMode = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeStore {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  initTheme: () => void;
}

const STORAGE_KEY = "rblxsec_theme";

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  if (resolved === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "dark",
  resolvedTheme: "dark",

  setTheme: (theme: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, theme);
    const resolved: ResolvedTheme = theme === "system" ? getSystemTheme() : theme;
    applyTheme(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  initTheme: () => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const theme: ThemeMode = stored ?? "system";
    const resolved: ResolvedTheme = theme === "system" ? getSystemTheme() : theme;
    applyTheme(resolved);
    set({ theme, resolvedTheme: resolved });

    // Listen for system preference changes when in "system" mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (get().theme === "system") {
        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
        applyTheme(newResolved);
        set({ resolvedTheme: newResolved });
      }
    };
    mq.addEventListener("change", handler);
  },
}));
