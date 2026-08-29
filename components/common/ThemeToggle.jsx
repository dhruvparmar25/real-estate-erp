"use client";

import { Icon } from "@/components/common/Icon";
import { useUiStore } from "@/store/ui.store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/utils/cn";

export function ThemeToggle({ className }) {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const mounted = useMounted();
  const baseClass = cn(
    "relative w-10 h-10 rounded-full hover:bg-(--color-bg) flex items-center justify-center text-(--color-text-primary) transition-colors",
    className
  );

  if (!mounted) {
    return <div aria-hidden className={baseClass} />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={baseClass}
    >
      <Icon
        icon={isDark ? "mdi:white-balance-sunny" : "mdi:weather-night"}
        width={20}
        className="transition-transform duration-300"
      />
    </button>
  );
}
