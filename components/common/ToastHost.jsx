"use client";

import { ToastCard } from "@/components/common/ToastCard";
import { ENV } from "@/config/env";
import { useToastStore } from "@/store/toast.store";

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (!toasts.length) return null;

  const position = ENV.toast.position;
  const positionClass =
    {
      "top-right": "top-4 right-4 items-end",
      "top-left": "top-4 left-4 items-start",
      "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
      "bottom-right": "bottom-4 right-4 items-end",
      "bottom-left": "bottom-4 left-4 items-start",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
    }[position] ?? "top-4 right-4 items-end";

  const offsetStyle = {
    top: position.startsWith("top") ? ENV.toast.offsetTop : undefined,
    right: position.endsWith("right") ? ENV.toast.offsetRight : undefined,
    bottom: position.startsWith("bottom") ? ENV.toast.offsetTop : undefined,
    left: position.endsWith("left") ? ENV.toast.offsetRight : undefined,
  };

  return (
    <div
      aria-live="polite"
      className={`fixed z-[9999] flex flex-col gap-3 pointer-events-none ${positionClass}`}
      style={offsetStyle}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter pointer-events-auto relative overflow-hidden rounded-[10px] bg-(--color-surface) shadow-[0_4px_14px_rgba(15,23,42,0.12),0_1px_4px_rgba(15,23,42,0.06)]"
        >
          <ToastCard
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            action={toast.action}
            closeToast={() => dismiss(toast.id)}
          />
          {toast.durationMs ? (
            <div className="h-1 w-full bg-(--color-border)">
              <div
                className={`toast-timer-bar h-full toast-progress-${toast.variant}`}
                style={{ animationDuration: `${toast.durationMs}ms` }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
