"use client";
import { cn } from "@/utils/cn";
export default function Tabs({ tabs, active, onChange, className }) {
    return (<div className={cn("border-b border-(--color-border) flex gap-1 overflow-x-auto", className)}>
      {tabs.map((t) => {
            const isActive = t.key === active;
            return (<button key={t.key} onClick={() => onChange(t.key)} className={cn("px-4 py-2.5 text-small font-medium border-b-2 -mb-px whitespace-nowrap transition inline-flex items-center gap-1.5", isActive
                    ? "border-(--color-primary) text-(--color-primary)"
                    : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)")}>
            <span>{t.label}</span>
            {typeof t.count === "number" && (<span className={cn("px-1.5 py-0.5 rounded-md text-tiny font-medium tabular-nums", isActive
                        ? "bg-(--color-primary)/15 text-(--color-primary)"
                        : "bg-(--color-bg) text-(--color-text-secondary)")}>
                {t.count}
              </span>)}
          </button>);
        })}
    </div>);
}
