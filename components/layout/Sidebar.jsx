"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icon } from "@/components/common/Icon";
import BrandLogo from "@/components/common/BrandLogo";
import { NAV_CONFIG } from "@/constants/nav-config";
import { ROUTES } from "@/constants/routes.constants";
import { ENV } from "@/config/env";
import { cn } from "@/utils/cn";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const activePath = useMemo(() => {
    if (!pathname) return "";
    let best = "";
    for (const section of NAV_CONFIG) {
      for (const item of section.items) {
        const matches = pathname === item.path || pathname.startsWith(`${item.path}/`);
        if (matches && item.path.length > best.length) best = item.path;
      }
    }
    return best;
  }, [pathname]);

  return (
    <aside
      className={cn(
        "fixed lg:static top-0 left-0 z-50 h-screen",
        "bg-(--color-surface) border-r border-(--color-border)",
        "flex flex-col",
        "transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
      style={{ width: 240 }}
    >
      <div className="flex justify-between items-center px-4 py-3 lg:hidden border-b border-(--color-border)">
        <h2 className="font-semibold text-h3">Menu</h2>
        <button onClick={onClose} aria-label="Close menu" className="p-1 rounded-lg hover:bg-(--color-bg)">
          <Icon icon="mdi:close" width={22} />
        </button>
      </div>

      <header className="flex-shrink-0 px-4 py-4 border-b border-(--color-border)">
        <Link href={ROUTES.dashboard} className="flex items-center justify-center group">
          <BrandLogo className="h-14 rounded-md" priority />
        </Link>
      </header>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_CONFIG.map((section, idx) => (
          <div key={section.title ?? idx} className={cn(idx > 0 && "mt-5")}>
            {section.title && (
              <div className="flex items-center gap-2 px-2 mb-1.5">
                <p className="text-tiny uppercase tracking-widest text-(--color-text-secondary)/70 font-semibold">
                  {section.title}
                </p>
                <div className="flex-1 h-px bg-(--color-border)/60" />
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = item.path === activePath;
                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={onClose}
                    className={cn(
                      "relative flex items-center gap-3 min-h-[36px] py-1.5 px-3 rounded-lg text-small transition-all group",
                      active
                        ? "bg-(--color-primary) text-(--color-primary-fg) font-medium shadow-sm shadow-(--color-primary)/20"
                        : "text-(--color-text-primary) hover:bg-(--color-bg) hover:text-(--color-primary)"
                    )}
                  >
                    <Icon
                      icon={item.icon}
                      width={18}
                      className={cn(
                        "flex-shrink-0",
                        !active && "text-(--color-text-secondary) group-hover:text-(--color-primary)",
                        active && "text-(--color-primary-fg)"
                      )}
                    />
                    <span className="whitespace-normal break-words leading-tight flex-1">{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-(--color-primary-fg)/80" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <footer className="flex-shrink-0 px-4 py-3 border-t border-(--color-border) bg-(--color-bg)/40">
        <div className="flex items-center justify-between gap-2 text-tiny">
          <span className="inline-flex items-center gap-1.5 text-(--color-text-secondary)">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-(--color-success) opacity-60 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-(--color-success)" />
            </span>
            <span className="font-medium">Mock mode</span>
          </span>
          <span className="text-(--color-text-secondary)/80 font-mono">v{ENV.appVersion}</span>
        </div>
      </footer>
    </aside>
  );
}
