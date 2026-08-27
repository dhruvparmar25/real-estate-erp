"use client";
import { createContext, useContext, useEffect, useState } from "react";
export const THEME_STORAGE_KEY = "re-erp:theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
function resolveTheme(value) {
    return value === "dark" ? "dark" : "light";
}
function persistTheme(t) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, t);
    }
    catch {
        /* ignore */
    }
    document.cookie = `${THEME_STORAGE_KEY}=${t};path=/;max-age=${THEME_COOKIE_MAX_AGE};samesite=lax`;
}
const ThemeCtx = createContext({
    theme: "light",
    setTheme: () => { },
    toggle: () => { },
});
export function ThemeProvider({ children, initialTheme, }) {
    const [theme, setThemeState] = useState(initialTheme ?? "light");
    useEffect(() => {
        let stored = "light";
        try {
            stored = resolveTheme(localStorage.getItem(THEME_STORAGE_KEY));
        }
        catch {
            /* ignore */
        }
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
    }, []);
    const setTheme = (t) => {
        setThemeState(t);
        document.documentElement.setAttribute("data-theme", t);
        persistTheme(t);
    };
    const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
    return (<ThemeCtx.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeCtx.Provider>);
}
export function useTheme() {
    return useContext(ThemeCtx);
}
