import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Real Estate ERP"),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1).default("0.1.0"),
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.coerce.number().int().positive().default(10),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().min(2).default("en-IN"),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().length(3).default("INR"),
  NEXT_PUBLIC_DEFAULT_DATE_FORMAT: z.string().min(1).default("dd/MM/yyyy"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional().default("http://localhost:8000/api"),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().default(""),
  NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS: z.coerce.number().int().positive().default(4000),
  NEXT_PUBLIC_TOAST_WARNING_DURATION_MS: z.coerce.number().int().positive().optional(),
  NEXT_PUBLIC_TOAST_ERROR_DURATION_MS: z.coerce.number().int().positive().optional(),
  NEXT_PUBLIC_TOAST_POSITION: z
    .enum([
      "top-right",
      "top-left",
      "top-center",
      "bottom-right",
      "bottom-left",
      "bottom-center",
    ])
    .default("top-right"),
  NEXT_PUBLIC_TOAST_LIMIT: z.coerce.number().int().positive().default(4),
  NEXT_PUBLIC_TOAST_OFFSET_TOP: z.coerce.number().int().nonnegative().default(16),
  NEXT_PUBLIC_TOAST_OFFSET_RIGHT: z.coerce.number().int().nonnegative().default(16),
  NEXT_PUBLIC_SESSION_COOKIE: z.string().min(1).default("re_erp_session"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`[env] Invalid environment variables:\n${parsed.error.toString()}`);
}

const raw = parsed.data;

export const ENV = Object.freeze({
  appName: raw.NEXT_PUBLIC_APP_NAME,
  appVersion: raw.NEXT_PUBLIC_APP_VERSION,
  defaultPageSize: raw.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
  defaultLocale: raw.NEXT_PUBLIC_DEFAULT_LOCALE,
  defaultCurrency: raw.NEXT_PUBLIC_DEFAULT_CURRENCY,
  defaultDateFormat: raw.NEXT_PUBLIC_DEFAULT_DATE_FORMAT,
  appUrl: raw.NEXT_PUBLIC_APP_URL,
  apiBaseUrl: raw.NEXT_PUBLIC_API_BASE_URL,
  googleMapsApiKey: raw.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  notificationShowTimeMs: raw.NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS,
  toast: Object.freeze({
    baseDurationMs: raw.NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS,
    warningDurationMs:
      raw.NEXT_PUBLIC_TOAST_WARNING_DURATION_MS ??
      Math.round(raw.NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS * 1.25),
    errorDurationMs:
      raw.NEXT_PUBLIC_TOAST_ERROR_DURATION_MS ??
      Math.round(raw.NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS * 1.5),
    position: raw.NEXT_PUBLIC_TOAST_POSITION,
    limit: raw.NEXT_PUBLIC_TOAST_LIMIT,
    offsetTop: raw.NEXT_PUBLIC_TOAST_OFFSET_TOP,
    offsetRight: raw.NEXT_PUBLIC_TOAST_OFFSET_RIGHT,
  }),
  sessionCookieName: raw.NEXT_PUBLIC_SESSION_COOKIE,
});
