"use client";

import { create } from "zustand";
import { ENV } from "@/config/env";

const DEFAULT_DURATIONS = {
  info: ENV.toast.baseDurationMs,
  success: ENV.toast.baseDurationMs,
  warning: ENV.toast.warningDurationMs,
  error: ENV.toast.errorDurationMs,
  loading: false,
};

const timers = new Map();

function clearTimer(id) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
}

function scheduleDismiss(id, ms) {
  clearTimer(id);
  if (ms === false || ms <= 0) return;
  timers.set(
    id,
    setTimeout(() => {
      useToastStore.getState().dismiss(id);
    }, ms)
  );
}

export const useToastStore = create((set, get) => ({
  toasts: [],

  push({ id, variant, title, description, action, duration, autoClose }) {
    const toastId = id ?? `${variant}:${title}`;
    const closeMs =
      autoClose !== undefined
        ? autoClose
        : duration !== undefined
          ? duration
          : DEFAULT_DURATIONS[variant] ?? DEFAULT_DURATIONS.info;

    clearTimer(toastId);

    const toast = {
      id: toastId,
      variant,
      title,
      description,
      action,
      durationMs: closeMs === false ? null : closeMs,
      createdAt: Date.now(),
    };

    set((state) => ({
      toasts: [...state.toasts.filter((t) => t.id !== toastId), toast].slice(
        -(ENV.toast.limit || 4)
      ),
    }));

    scheduleDismiss(toastId, closeMs);
    return toastId;
  },

  dismiss(id) {
    clearTimer(id);
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  dismissAll() {
    get().toasts.forEach((t) => clearTimer(t.id));
    set({ toasts: [] });
  },

  resolve(id, { variant, title, description, duration }) {
    clearTimer(id);
    const closeMs = duration ?? DEFAULT_DURATIONS[variant] ?? DEFAULT_DURATIONS.info;

    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id
          ? {
              ...t,
              variant,
              title,
              description,
              durationMs: closeMs === false ? null : closeMs,
              createdAt: Date.now(),
            }
          : t
      ),
    }));

    scheduleDismiss(id, closeMs);
  },
}));
