"use client";

import { useToastStore } from "@/store/toast.store";
import { ENV } from "@/config/env";

const DEFAULT_DURATIONS = {
  info: ENV.toast.baseDurationMs,
  success: ENV.toast.baseDurationMs,
  warning: ENV.toast.warningDurationMs,
  error: ENV.toast.errorDurationMs,
  loading: false,
};

const GENERIC_API_MESSAGES = new Set([
  "Validation error.",
  "Validation failed.",
  "Error",
  "Bad Request",
  "Internal Server Error",
]);

const recentKeys = new Map();
const DEDUPE_MS = 400;

function shouldSkipDuplicate(id) {
  const now = Date.now();
  const last = recentKeys.get(id);
  if (last && now - last < DEDUPE_MS) return true;
  recentKeys.set(id, now);
  return false;
}

function show(variant, title, options = {}) {
  const { description, duration, id, action, autoClose } = options;
  const toastId = id ?? `${variant}:${title}`;

  if (shouldSkipDuplicate(toastId)) return toastId;

  return useToastStore.getState().push({
    id: toastId,
    variant,
    title,
    description,
    action,
    duration,
    autoClose,
  });
}

export const notifySuccess = (title, options) => show("success", title, options);
export const notifyInfo = (title, options) => show("info", title, options);
export const notifyWarning = (title, options) => show("warning", title, options);

export const notifyError = (error, fallbackOrOptions, maybeOptions) => {
  const fallback =
    typeof fallbackOrOptions === "string"
      ? fallbackOrOptions
      : "Something went wrong. Please try again.";
  const options = typeof fallbackOrOptions === "string" ? maybeOptions : fallbackOrOptions;
  const title = getApiErrorMessage(error, fallback);
  return show("error", title, options);
};

export const notifyLoading = (title, options) =>
  show("loading", title, { ...options, duration: false, autoClose: false });

export const dismissNotification = (id) => {
  if (id !== undefined) useToastStore.getState().dismiss(id);
  else useToastStore.getState().dismissAll();
};

function resolveToast(id, variant, title, description) {
  useToastStore.getState().resolve(id, {
    variant,
    title,
    description,
    duration: DEFAULT_DURATIONS[variant],
  });
}

export async function notifyPromise(promise, messages) {
  const loadingTitle =
    typeof messages.loading === "string" ? messages.loading : "Loading…";
  const id = notifyLoading(loadingTitle, {
    description: messages.description?.loading,
    id: messages.id ? `${messages.id}:loading` : undefined,
  });
  try {
    const result = await promise;
    const title =
      typeof messages.success === "function" ? messages.success(result) : messages.success;
    const description =
      typeof messages.description?.success === "function"
        ? messages.description.success(result)
        : messages.description?.success;
    resolveToast(id, "success", title, description);
    return result;
  } catch (err) {
    const title =
      typeof messages.error === "function"
        ? messages.error(err)
        : getApiErrorMessage(err, messages.error);
    const description =
      typeof messages.description?.error === "function"
        ? messages.description.error(err)
        : messages.description?.error;
    resolveToast(id, "error", title, description);
    throw err;
  }
}

const cleanErrorMessage = (msg) => {
  const matches = [...msg.matchAll(/string=['"]([^'"\\]+)['"]/g)];
  if (matches.length) {
    return matches.map((m) => m[1]).join(" ");
  }
  return msg;
};

const extractFieldErrors = (errorsObj) => {
  if (!errorsObj || typeof errorsObj !== "object") return [];
  const msgs = [];
  if (Array.isArray(errorsObj)) {
    for (const v of errorsObj) {
      if (typeof v === "string" && v.trim()) msgs.push(v);
    }
    return msgs;
  }
  for (const [key, val] of Object.entries(errorsObj)) {
    if (Array.isArray(val)) {
      for (const v of val) {
        if (typeof v === "string" && v.trim()) msgs.push(v);
      }
    } else if (key === "detail" && typeof val === "string" && val.trim()) {
      msgs.push(val);
    } else if (typeof val === "string" && val.trim()) {
      msgs.push(val);
    }
  }
  return msgs;
};

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const err = error;
  const data = err.response?.data;
  if (data) {
    if (data.errors) {
      const fieldMsgs = extractFieldErrors(data.errors);
      if (fieldMsgs.length) return fieldMsgs.map(cleanErrorMessage).join(" ");
    }
    const pick = (key) => {
      const v = data[key];
      if (typeof v !== "string") return undefined;
      if (GENERIC_API_MESSAGES.has(v)) return undefined;
      return cleanErrorMessage(v);
    };
    const primary = pick("message") ?? pick("error") ?? pick("detail");
    if (primary) return primary;
    const reserved = new Set(["message", "errors", "error", "detail"]);
    const fieldErrors = Object.entries(data)
      .filter(
        ([key, val]) => !reserved.has(key) && (Array.isArray(val) || typeof val === "string")
      )
      .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
      .join(" | ");
    if (fieldErrors) return fieldErrors;
    if (typeof data.message === "string") return cleanErrorMessage(data.message);
  }
  return err.message || fallback;
}
