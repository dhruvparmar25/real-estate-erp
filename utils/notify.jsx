"use client";
import { toast } from "react-toastify";
import { ToastCard } from "@/components/common/ToastCard";
import { ENV } from "@/config/env";
const BASE_MS = ENV.notificationShowTimeMs;
const DEFAULT_DURATIONS = {
    info: BASE_MS,
    success: BASE_MS,
    warning: Math.round(BASE_MS * 1.25),
    error: Math.round(BASE_MS * 1.5),
    loading: false,
};
const GENERIC_API_MESSAGES = new Set([
    "Validation error.",
    "Validation failed.",
    "Error",
    "Bad Request",
    "Internal Server Error",
]);
const toastBaseOpts = {
    closeButton: false,
    icon: false,
    style: { padding: 0, background: "transparent", boxShadow: "none", minHeight: "unset" },
    progressStyle: { background: "var(--color-primary)" },
};
function show(variant, title, options = {}) {
    const { description, duration, id, action } = options;
    const autoClose = duration !== undefined
        ? Number.isFinite(duration)
            ? duration
            : false
        : DEFAULT_DURATIONS[variant];
    const content = ({ closeToast }) => (<ToastCard variant={variant} title={title} description={description} action={action} closeToast={closeToast}/>);
    const opts = { ...toastBaseOpts, toastId: id, autoClose };
    switch (variant) {
        case "success": return toast.success(content, opts);
        case "error": return toast.error(content, opts);
        case "warning": return toast.warning(content, opts);
        case "info": return toast.info(content, opts);
        case "loading": return toast.loading(content, { ...opts, autoClose: false });
        default: return toast(content, opts);
    }
}
export const notifySuccess = (title, options) => show("success", title, options);
export const notifyInfo = (title, options) => show("info", title, options);
export const notifyWarning = (title, options) => show("warning", title, options);
export const notifyError = (error, fallbackOrOptions, maybeOptions) => {
    const fallback = typeof fallbackOrOptions === "string"
        ? fallbackOrOptions
        : "Something went wrong. Please try again.";
    const options = typeof fallbackOrOptions === "string" ? maybeOptions : fallbackOrOptions;
    const title = getApiErrorMessage(error, fallback);
    return show("error", title, options);
};
export const notifyLoading = (title, options) => show("loading", title, options);
export const dismissNotification = (id) => {
    if (id !== undefined)
        toast.dismiss(id);
    else
        toast.dismiss();
};
function resolveToast(id, variant, title, description) {
    toast.update(id, {
        ...toastBaseOpts,
        render: ({ closeToast }) => (<ToastCard variant={variant} title={title} description={description} closeToast={closeToast}/>),
        type: variant,
        autoClose: DEFAULT_DURATIONS[variant],
    });
}
export async function notifyPromise(promise, messages) {
    const id = notifyLoading(messages.loading, {
        description: messages.description?.loading,
    });
    try {
        const result = await promise;
        const title = typeof messages.success === "function" ? messages.success(result) : messages.success;
        const description = typeof messages.description?.success === "function"
            ? messages.description.success(result)
            : messages.description?.success;
        resolveToast(id, "success", title, description);
        return result;
    }
    catch (err) {
        const title = typeof messages.error === "function"
            ? messages.error(err)
            : getApiErrorMessage(err, messages.error);
        const description = typeof messages.description?.error === "function"
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
    if (!errorsObj || typeof errorsObj !== "object")
        return [];
    const msgs = [];
    if (Array.isArray(errorsObj)) {
        for (const v of errorsObj) {
            if (typeof v === "string" && v.trim())
                msgs.push(v);
        }
        return msgs;
    }
    for (const [key, val] of Object.entries(errorsObj)) {
        if (Array.isArray(val)) {
            for (const v of val) {
                if (typeof v === "string" && v.trim())
                    msgs.push(v);
            }
        }
        else if (key === "detail" && typeof val === "string" && val.trim()) {
            msgs.push(val);
        }
        else if (typeof val === "string" && val.trim()) {
            msgs.push(val);
        }
    }
    return msgs;
};
export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    if (!error)
        return fallback;
    if (typeof error === "string")
        return error;
    const err = error;
    const data = err.response?.data;
    if (data) {
        if (data.errors) {
            const fieldMsgs = extractFieldErrors(data.errors);
            if (fieldMsgs.length)
                return fieldMsgs.map(cleanErrorMessage).join(" ");
        }
        const pick = (key) => {
            const v = data[key];
            if (typeof v !== "string")
                return undefined;
            if (GENERIC_API_MESSAGES.has(v))
                return undefined;
            return cleanErrorMessage(v);
        };
        const primary = pick("message") ?? pick("error") ?? pick("detail");
        if (primary)
            return primary;
        const reserved = new Set(["message", "errors", "error", "detail"]);
        const fieldErrors = Object.entries(data)
            .filter(([key, val]) => !reserved.has(key) && (Array.isArray(val) || typeof val === "string"))
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join(" | ");
        if (fieldErrors)
            return fieldErrors;
        if (typeof data.message === "string")
            return cleanErrorMessage(data.message);
    }
    return err.message || fallback;
}
