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
export const TOAST_ENTER_MS = 420;
export const TOAST_EXIT_MS = 300;

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
    const toast = get().toasts.find((t) => t.id === id);
    if (!toast || toast.exiting) return;

    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, TOAST_EXIT_MS);
  },

  dismissAll() {
    get().toasts.forEach((t) => clearTimer(t.id));
    set((state) => ({
      toasts: state.toasts.map((t) => ({ ...t, exiting: true })),
    }));
    setTimeout(() => {
      set({ toasts: [] });
    }, TOAST_EXIT_MS);
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
