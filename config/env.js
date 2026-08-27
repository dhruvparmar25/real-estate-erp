import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Real Estate ERP"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("0.1.0"),
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.string().default("10"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("en-IN"),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().default("INR"),
  NEXT_PUBLIC_DEFAULT_DATE_FORMAT: z.string().default("dd/MM/yyyy"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().default(""),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().default(""),
  NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS: z.string().default("4000"),
  NEXT_PUBLIC_SESSION_COOKIE: z.string().default("re_erp_session"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY,
  NEXT_PUBLIC_DEFAULT_DATE_FORMAT: process.env.NEXT_PUBLIC_DEFAULT_DATE_FORMAT,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS: process.env.NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS,
  NEXT_PUBLIC_SESSION_COOKIE: process.env.NEXT_PUBLIC_SESSION_COOKIE,
});

if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}

const raw = parsed.data;

// DOT notation so Next can inline NEXT_PUBLIC_* into the client bundle.
export const ENV = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? raw.NEXT_PUBLIC_APP_NAME,
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? raw.NEXT_PUBLIC_APP_VERSION,
  defaultPageSize: parseInt(
    process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE ?? raw.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
    10
  ),
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? raw.NEXT_PUBLIC_DEFAULT_LOCALE,
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? raw.NEXT_PUBLIC_DEFAULT_CURRENCY,
  defaultDateFormat:
    process.env.NEXT_PUBLIC_DEFAULT_DATE_FORMAT ?? raw.NEXT_PUBLIC_DEFAULT_DATE_FORMAT,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? raw.NEXT_PUBLIC_APP_URL,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? raw.NEXT_PUBLIC_API_BASE_URL,
  googleMapsApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? raw.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  notificationShowTimeMs: parseInt(
    process.env.NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS ??
      raw.NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS,
    10
  ),
  sessionCookieName:
    process.env.NEXT_PUBLIC_SESSION_COOKIE ?? raw.NEXT_PUBLIC_SESSION_COOKIE,
};
