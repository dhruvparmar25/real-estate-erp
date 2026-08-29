"use client";

import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";

const VARIANTS = {
  success: {
    icon: "mdi:check",
    iconWrap: "bg-(--color-success)",
  },
  error: {
    icon: "mdi:alert-circle",
    iconWrap: "bg-(--color-danger)",
  },
  warning: {
    icon: "mdi:alert-circle",
    iconWrap: "bg-(--color-warning)",
  },
  info: {
    icon: "mdi:information",
    iconWrap: "bg-(--color-info)",
  },
  loading: {
    icon: "mdi:loading",
    iconWrap: "bg-(--color-primary)",
  },
};

export function ToastCard({ variant, title, description, action, closeToast }) {
  const v = VARIANTS[variant] ?? VARIANTS.info;
  const isLoading = variant === "loading";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className="toast-card flex w-full min-w-[280px] max-w-[420px] items-center gap-3 px-4 py-3.5"
    >
      <span
        aria-hidden
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white",
          v.iconWrap
        )}
      >
        <Icon
          icon={v.icon}
          width={variant === "success" ? 20 : 18}
          className={cn(isLoading && "toast-spin")}
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-small leading-snug text-(--color-text-primary)">{title}</p>
        {description ? (
          <p className="mt-0.5 text-tiny leading-relaxed text-(--color-text-secondary)">
            {description}
          </p>
        ) : null}
        {action ? (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              closeToast?.();
            }}
            className="mt-2 inline-flex h-7 items-center rounded-md border border-(--color-border) px-2.5 text-tiny font-medium text-(--color-text-primary) hover:bg-(--color-bg) transition-colors"
          >
            {action.label}
          </button>
        ) : null}
      </div>

      {closeToast ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={closeToast}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-(--color-text-tertiary) hover:text-(--color-text-secondary) transition-colors"
        >
          <Icon icon="mdi:close" width={18} />
        </button>
      ) : null}
    </div>
  );
}
