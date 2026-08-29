"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const THEME_COOKIE = "re-erp:theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

function applyThemeClass(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=${ONE_YEAR};samesite=lax`;
}

export const useUiStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => {
        applyThemeClass(theme);
        set({ theme });
      },
      toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
    }),
    { name: "ui-store", storage: createJSONStorage(() => localStorage) }
  )
);
