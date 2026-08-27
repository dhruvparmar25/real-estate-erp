import { format, parseISO, isValid } from "date-fns";
import { ENV } from "@/config/env";
export function formatDate(value, pattern = ENV.defaultDateFormat) {
    if (!value)
        return "—";
    const d = typeof value === "string" ? parseISO(value) : value;
    if (!isValid(d))
        return "—";
    return format(d, pattern);
}
export function formatDateTime(value) {
    if (!value)
        return "—";
    return formatDate(value, `${ENV.defaultDateFormat} HH:mm`);
}
export function formatCurrency(value) {
    if (value === null || value === undefined || value === "")
        return "—";
    const n = typeof value === "string" ? Number(value) : value;
    if (!Number.isFinite(n))
        return "—";
    return new Intl.NumberFormat(ENV.defaultLocale, {
        style: "currency",
        currency: ENV.defaultCurrency,
        maximumFractionDigits: 2,
    }).format(n);
}
export function formatNumber(value) {
    if (value === null || value === undefined || value === "")
        return "—";
    const n = typeof value === "string" ? Number(value) : value;
    if (!Number.isFinite(n))
        return "—";
    return new Intl.NumberFormat(ENV.defaultLocale).format(n);
}
export function maskPhone(phone) {
    if (!phone)
        return "—";
    return phone.replace(/(\+?\d{2,3})(\d+)(\d{2})/, (_, a, b, c) => `${a} ${"•".repeat(b.length)}${c}`);
}
export function titleCase(value) {
    if (!value)
        return "—";
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
}
export function initialsOf(...parts) {
    return parts
        .filter(Boolean)
        .map((p) => p.trim()[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2);
}
