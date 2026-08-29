"use client";

import { useLayoutEffect, useState } from "react";
import { ToastCard } from "@/components/common/ToastCard";
import { ENV } from "@/config/env";
import { useToastStore, TOAST_ENTER_MS } from "@/store/toast.store";
import { cn } from "@/utils/cn";

function getPositionConfig(position) {
  if (position.endsWith("left")) {
    return {
      container: position.startsWith("top")
        ? "top-4 left-4 items-start"
        : "bottom-4 left-4 items-start",
      side: "left",
      offsetStyle: {
        top: position.startsWith("top") ? ENV.toast.offsetTop : undefined,
        left: ENV.toast.offsetRight,
        bottom: position.startsWith("bottom") ? ENV.toast.offsetTop : undefined,
      },
    };
  }

  if (position.includes("center")) {
    return {
      container: position.startsWith("top")
        ? "top-4 left-1/2 -translate-x-1/2 items-center"
        : "bottom-4 left-1/2 -translate-x-1/2 items-center",
      side: "center",
      offsetStyle: {
        top: position.startsWith("top") ? ENV.toast.offsetTop : undefined,
        bottom: position.startsWith("bottom") ? ENV.toast.offsetTop : undefined,
      },
    };
  }

  return {
    container: position.startsWith("bottom") ? "bottom-4 right-4 items-end" : "top-4 right-4 items-end",
    side: "right",
    offsetStyle: {
      top: position.startsWith("top") ? ENV.toast.offsetTop : undefined,
      right: ENV.toast.offsetRight,
      bottom: position.startsWith("bottom") ? ENV.toast.offsetTop : undefined,
    },
  };
}

function ToastItem({ toast, side, onDismiss }) {
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    if (toast.exiting) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [toast.id, toast.exiting]);

  const preEnterClass =
    side === "left"
      ? "toast-pre-enter-left"
      : side === "center"
        ? "toast-pre-enter-center"
        : "toast-pre-enter-right";

  const enterClass =
    side === "left"
      ? "toast-enter-left"
      : side === "center"
        ? "toast-enter-center"
        : "toast-enter-right";

  const exitClass =
    side === "left"
      ? "toast-exit-left"
      : side === "center"
        ? "toast-exit-center"
        : "toast-exit-right";

  const animClass = toast.exiting ? exitClass : entered ? enterClass : preEnterClass;

  return (
    <div className={cn("toast-shell pointer-events-auto", animClass)}>
      <div className="relative overflow-hidden rounded-[10px] bg-(--color-surface) shadow-[0_4px_14px_rgba(15,23,42,0.12),0_1px_4px_rgba(15,23,42,0.06)]">
        <ToastCard
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          closeToast={() => onDismiss(toast.id)}
        />
        {toast.durationMs && !toast.exiting && entered ? (
          <div className="h-1 w-full bg-(--color-border)">
            <div
              className={cn("toast-timer-bar h-full", `toast-progress-${toast.variant}`)}
              style={{
                animationDuration: `${toast.durationMs}ms`,
                animationDelay: `${TOAST_ENTER_MS}ms`,
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const { container, side, offsetStyle } = getPositionConfig(ENV.toast.position);

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className={cn("fixed z-[9999] flex flex-col gap-3 overflow-visible pointer-events-none", container)}
      style={offsetStyle}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} side={side} onDismiss={dismiss} />
      ))}
    </div>
  );
}
