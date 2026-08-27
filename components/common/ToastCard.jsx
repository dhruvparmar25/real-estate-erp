"use client";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
const VARIANTS = {
    success: {
        icon: "mdi:check-circle",
        iconClass: "tone-success-fg",
        iconBg: "tone-success-bg",
        accent: "bg-(--color-success)",
    },
    error: {
        icon: "mdi:close-circle-outline",
        iconClass: "tone-danger-fg",
        iconBg: "tone-danger-bg",
        accent: "bg-(--color-danger)",
    },
    warning: {
        icon: "mdi:alert-circle-outline",
        iconClass: "tone-warning-fg",
        iconBg: "tone-warning-bg",
        accent: "bg-(--color-warning)",
    },
    info: {
        icon: "mdi:information-outline",
        iconClass: "tone-info-fg",
        iconBg: "tone-info-bg",
        accent: "bg-(--color-info)",
    },
    loading: {
        icon: "mdi:cloud-sync-outline",
        iconClass: "tone-primary-fg",
        iconBg: "tone-primary-bg",
        accent: "bg-(--color-primary)",
    },
};
export function ToastCard({ variant, title, description, action, closeToast }) {
    const v = VARIANTS[variant];
    return (<div role={variant === "error" ? "alert" : "status"} aria-live={variant === "error" ? "assertive" : "polite"} className="pointer-events-auto flex w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-(--color-border) bg-(--color-elevated) shadow-[var(--shadow-popover)]">
      <span aria-hidden className={cn("w-1 shrink-0", v.accent)}/>

      <div className="flex flex-1 items-start gap-2.5 pl-2.5 pr-2 py-3">
        <span aria-hidden className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", v.iconBg)}>
          {variant === "loading" ? (<Icon icon={v.icon} width={15} className={cn(v.iconClass, "toast-spin")}/>) : (<Icon icon={v.icon} width={17} className={v.iconClass}/>)}
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-small font-semibold text-(--color-text-primary) leading-snug">
            {title}
          </p>
          {description ? (<p className="mt-1 text-tiny text-(--color-text-secondary) leading-relaxed">
              {description}
            </p>) : null}
          {action ? (<button type="button" onClick={() => {
                action.onClick();
                closeToast?.();
            }} className="mt-1.5 inline-flex h-6 items-center rounded-md border border-(--color-border) bg-(--color-surface) px-2 text-tiny font-medium text-(--color-text-primary) hover:bg-(--color-bg)">
              {action.label}
            </button>) : null}
        </div>

        {closeToast ? (<button type="button" aria-label="Dismiss" onClick={closeToast} className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-(--color-text-tertiary) hover:bg-(--color-bg) hover:text-(--color-text-primary)">
            <Icon icon="mdi:close" width={14}/>
          </button>) : null}
      </div>
    </div>);
}
