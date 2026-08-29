# Real-Estate ERP — Core Setup Code Review

## 1. Blocker issues

### 1.1 🔴 Middleware file is named `proxy.js` — Next.js will never run it
**Where:** `d:\Development\real-estate-erp-FE\proxy.js`

**Problem:** Next.js only recognises `middleware.ts` / `middleware.js` at the project root (or under `src/`). The file is named `proxy.js` and exports a function called `proxy`, so:
- The auth guard **never executes**.
- `PUBLIC_ROUTES`, session-cookie redirect to `/login`, and the "already signed in → dashboard" bounce are all dead code.
- Every route is effectively unprotected on the edge (AGENTS Rule 4: *"Gate routes: middleware.ts at the edge …"*).

**Fix:** Rename the file to `middleware.js` and export a function named `middleware`.
```js
// d:\Development\real-estate-erp-FE\middleware.js
import { NextResponse } from "next/server";
import { ENV } from "@/config/env";
import { PUBLIC_ROUTES, ROUTES } from "@/constants/routes.constants";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const session = request.cookies.get(ENV.sessionCookieName)?.value;

  if (!session && !isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ROUTES.login;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && pathname === ROUTES.login) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = ROUTES.dashboard;
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

Delete `proxy.js` after copying.

---

### 1.2 🔴 Whole project is JavaScript — AGENTS Rule 12 mandates strict TypeScript
**Where:** every `*.js` / `*.jsx` file; `jsconfig.json` sets `"strict": false, "checkJs": false`.

**Problem:** AGENTS Rule 12: *"No `any`. `strict: true`, always. Explicit parameter and return types. `interface`/`type`, meaningful generics."*
Right now:
- Zero prop typing on components with 10+ props (e.g. `DataTable`, `ListPageShell`, `FormField`).
- Refactors are unsafe; the compiler can't catch broken renames.
- Zod schemas produce inferred types that the codebase can't use.

**Fix (starter-phase migration plan):**
1. Convert `jsconfig.json` → `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "lib": ["dom", "dom.iterable", "esnext"],
       "module": "esnext",
       "moduleResolution": "bundler",
       "jsx": "preserve",
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "noImplicitOverride": true,
       "allowJs": false,
       "checkJs": false,
       "isolatedModules": true,
       "resolveJsonModule": true,
       "incremental": true,
       "esModuleInterop": true,
       "noEmit": true,
       "plugins": [{ "name": "next" }],
       "paths": { "@/*": ["./*"] }
     },
     "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "next-env.d.ts"],
     "exclude": ["node_modules", ".next"]
   }
   ```
2. Add `typescript`, `@types/react`, `@types/react-dom`, `@types/node` to dev deps.
3. Rename files feature by feature (`.js` → `.ts`, `.jsx` → `.tsx`) and add typed `Props`.
4. Derive shared types from Zod: `export type User = z.infer<typeof userSchema>`.

---

### 1.3 🔴 Design tokens & typography used everywhere are not defined
**Where:** `app/globals.css` defines only a handful of variables. Components read many that don't exist.

Undefined but heavily used:
- Colors: `--color-secondary`, `--color-success`, `--color-warning`, `--color-info`, `--color-success-soft`, `--color-warning-soft`, `--color-danger-soft`, `--color-info-soft`, `--color-elevated`, `--color-border-strong`, `--color-overlay`.
- Tone utilities: `tone-success-fg`, `tone-success-bg`, `tone-warning-fg`, `tone-warning-bg`, `tone-info-fg`, `tone-info-bg`, `tone-primary-fg`, `tone-primary-bg`, `tone-danger-fg`, `tone-danger-bg` (used in `ToastCard.jsx`).
- Typography helpers: `.module-title`, `.card-title`, `text-h1`..`text-h4`, `text-body` (used in `PageHeader`, `Modal`, `EmptyState`, `login/page.js` etc.).
- Animations: `.toast-spin`, `.app-spinner`, `.route-progress-loading`, `.route-progress-complete`.

**Result:** Toasts, buttons, badges, modal, spinner, dark-mode surfaces all render broken or invisible.

**Fix:** Move to Tailwind v4 `@theme` blocks in `app/globals.css` and define every token for both light and dark:
```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-primary: #1d4ed8;
  --color-primary-hover: #1e40af;
  --color-primary-fg: #ffffff;
  --color-secondary: #0891b2;

  /* Neutrals */
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-elevated: #ffffff;
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-overlay: rgba(15, 23, 42, 0.45);

  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;

  /* Semantic */
  --color-success: #16a34a;
  --color-success-soft: #dcfce7;
  --color-warning: #d97706;
  --color-warning-soft: #fef3c7;
  --color-danger: #ef4444;
  --color-danger-soft: #fee2e2;
  --color-info: #2563eb;
  --color-info-soft: #dbeafe;

  --shadow-popover: 0 10px 25px rgba(15, 23, 42, 0.1), 0 4px 10px rgba(15, 23, 42, 0.06);

  /* Typography */
  --font-body: var(--font-inter);
  --font-display: var(--font-philosopher);
  --font-mono: var(--font-jetbrains);

  --text-tiny: 0.75rem;
  --text-small: 0.875rem;
  --text-body: 1rem;
  --text-h4: 1.125rem;
  --text-h3: 1.25rem;
  --text-h2: 1.5rem;
  --text-h1: 2rem;
}

@layer base {
  html.dark {
    --color-bg: #0b1220;
    --color-surface: #0f172a;
    --color-elevated: #111827;
    --color-border: #1f2a44;
    --color-border-strong: #334155;
    --color-overlay: rgba(0, 0, 0, 0.6);
    --color-text-primary: #f8fafc;
    --color-text-secondary: #cbd5e1;
    --color-text-tertiary: #64748b;
  }
}

@layer components {
  .module-title { font-size: var(--text-h2); font-weight: 600; letter-spacing: -0.01em; }
  .card-title   { font-size: var(--text-h4); font-weight: 600; }
}

@layer utilities {
  .text-tiny  { font-size: var(--text-tiny); }
  .text-small { font-size: var(--text-small); }
  .text-body  { font-size: var(--text-body); }
  .text-h4    { font-size: var(--text-h4); }
  .text-h3    { font-size: var(--text-h3); }
  .text-h2    { font-size: var(--text-h2); }
  .text-h1    { font-size: var(--text-h1); }

  .tone-primary-bg { background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); }
  .tone-primary-fg { color: var(--color-primary); }
  .tone-success-bg { background-color: color-mix(in srgb, var(--color-success) 12%, transparent); }
  .tone-success-fg { color: var(--color-success); }
  .tone-warning-bg { background-color: color-mix(in srgb, var(--color-warning) 12%, transparent); }
  .tone-warning-fg { color: var(--color-warning); }
  .tone-danger-bg  { background-color: color-mix(in srgb, var(--color-danger) 12%, transparent); }
  .tone-danger-fg  { color: var(--color-danger); }
  .tone-info-bg    { background-color: color-mix(in srgb, var(--color-info) 12%, transparent); }
  .tone-info-fg    { color: var(--color-info); }

  @keyframes toast-spin { to { transform: rotate(360deg); } }
  .toast-spin { animation: toast-spin 1s linear infinite; }

  @keyframes app-spinner { to { transform: rotate(360deg); } }
  .app-spinner { animation: app-spinner 0.9s linear infinite; display: inline-block; }

  @keyframes route-progress-in {
    from { transform: scaleX(0); }
    to   { transform: scaleX(0.85); }
  }
  .route-progress-loading  { animation: route-progress-in 8s cubic-bezier(0.1, 0.7, 0.1, 1) forwards; }
  .route-progress-complete { transform: scaleX(1); transition: opacity 250ms ease; opacity: 0; }
}
```

Also load fonts in `app/layout.tsx` via `next/font` (see 4.1).


---

### 1.4 🔴 Dark-mode wiring is inconsistent with AGENTS Rule 19
**Where:** `hooks/use-theme.jsx`, `app/layout.js`, `app/globals.css`.

**Problem:**
- AGENTS Rule 19: *"Dark mode toggles the `.dark` class on `<html>`."*
- Current code sets `document.documentElement.setAttribute("data-theme", stored)` instead.
- Theme lives in a **React Context** but AGENTS Rule 19 + Rule 7 say it should live in Zustand `store/ui.store.ts`.
- Initial theme is read only inside `useEffect` → SSR renders light, client flips → **theme flash** on every reload.

**Fix:**
1. Create `store/ui.store.js` (Zustand) as the source of truth.
2. Read the cookie server-side in `app/layout.tsx` and set the `.dark` class synchronously.
3. Delete the Context.

```js
// store/ui.store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const THEME_COOKIE = "re-erp:theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

export const useUiStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=${ONE_YEAR};samesite=lax`;
        }
        set({ theme });
      },
      toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
    }),
    { name: "ui-store", storage: createJSONStorage(() => localStorage) }
  )
);
```

```tsx
// app/layout.tsx
import { cookies } from "next/headers";
import { Inter, Philosopher, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const philosopher = Philosopher({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-philosopher", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export default async function RootLayout({ children }) {
  const theme = (await cookies()).get("re-erp:theme")?.value === "dark" ? "dark" : "light";
  return (
    <html lang="en"
      className={`${inter.variable} ${philosopher.variable} ${jetbrains.variable} ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning>
      <body className="bg-(--color-bg) text-(--color-text-primary) font-(family-name:var(--font-body))">
        <AppProviders initialTheme={theme}>{children}</AppProviders>
      </body>
    </html>
  );
}
```

Delete `hooks/use-theme.jsx`. Update `ThemeToggle` to call `useUiStore.getState().toggleTheme()`.

---

### 1.5 🔴 `services/api-client.js` — missing request interceptor & CSRF header
**Where:** `services/api-client.js`.

**Problems:**
1. AGENTS Rule 5: *"One Axios instance… token via request interceptor, 401→login / 403→/403 via response interceptor."* — the request interceptor is missing entirely.
2. Because the backend is Django with cookie-based auth (`withCredentials: true`), Django's CSRF middleware requires an `X-CSRFToken` header on unsafe methods. Never sent → every POST/PUT/PATCH/DELETE returns 403.
3. `PUBLIC_AUTH_ENDPOINTS` matching uses fragile `endsWith` — a real path like `/tenants/auth/login/` would falsely match.
4. `window.location.assign` hard-navigates and drops React state; should also stop from firing during SSR (`typeof window`).

**Fix:**
```js
// services/api-client.js
import axios from "axios";
import { ENV } from "@/config/env";
import { ROUTES } from "@/constants/routes.constants";
import { API_ENDPOINTS } from "@/constants/api-endpoints.constants";

const CSRF_COOKIE = "csrftoken";
const CSRF_HEADER = "X-CSRFToken";
const UNSAFE = new Set(["post", "put", "patch", "delete"]);
const PUBLIC_AUTH = new Set([API_ENDPOINTS.AUTH.LOGIN]);

function readCookie(name) {
  if (typeof document === "undefined") return "";
  return document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1] ?? "";
}

export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: 20_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (config.method && UNSAFE.has(config.method.toLowerCase())) {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) config.headers[CSRF_HEADER] = csrf;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);
    const path = (error.config?.url ?? "").split("?")[0].replace(/\/$/, "");
    const isPublicAuth = [...PUBLIC_AUTH].some((p) => path.endsWith(p.replace(/\/$/, "")));
    const status = error.response?.status;
    if (status === 401 && !isPublicAuth) window.location.assign(ROUTES.login);
    else if (status === 403 && !isPublicAuth) window.location.assign(ROUTES.forbidden);
    return Promise.reject(error);
  }
);

export const apiGet    = (url, config)       => apiClient.get(url, config).then((r) => r.data);
export const apiPost   = (url, data, config) => apiClient.post(url, data, config).then((r) => r.data);
export const apiPatch  = (url, data, config) => apiClient.patch(url, data, config).then((r) => r.data);
export const apiPut    = (url, data, config) => apiClient.put(url, data, config).then((r) => r.data);
export const apiDelete = (url, config)       => apiClient.delete(url, config).then((r) => r.data);
```


---

### 1.6 🔴 No session bootstrap → auth store is empty on every reload
**Where:** `store/auth.store.js` + missing provider.

**Problem:** AGENTS Rule 4: *"Never store [permissions] in localStorage."* Correct — but then something must **rehydrate the store from `/auth/me` on app start**. Nothing does. Symptoms:
- After F5, `isAuthenticated = false` for one tick → any client-only guard flashes login even though the cookie is valid.
- `usePermission()` returns `false` for everything until the first manual query.

**Fix:** Add an `AuthBootstrap` client provider that runs a `useQuery` on `QUERY_KEYS.auth.me()` and pipes the result into the store.

```jsx
// components/providers/AuthBootstrap.jsx
"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/services/auth.api";
import { QUERY_KEYS } from "@/constants/query-keys.constants";
import { useAuthStore } from "@/store/auth.store";

export function AuthBootstrap({ children }) {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const { data, isSuccess, isError } = useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) setSession({ user: data, permissions: data.permissions ?? [] });
    if (isError) clearSession();
  }, [isSuccess, isError, data, setSession, clearSession]);

  return children;
}
```
Mount inside `AppProviders` **inside** `QueryProvider`.

---

### 1.7 🔴 `document.body` referenced during render (SSR crash)
**Where:** `components/common/FormField.jsx` (`SelectField`, `SearchSelectField`), `SearchableSelect.jsx`, `SearchableSelectField.jsx`, `SearchableMultiSelectField.jsx`.

**Problem:** `menuPortalTarget={document.body}` runs during the render phase. In Server Components / SSR / test render, `document` is undefined → `ReferenceError`. AGENTS Rule 8 (*Server by default*) becomes impossible for any page importing these fields.

**Fix:** Gate on the already-existing `useMounted()` hook.
```jsx
const mounted = useMounted();
<Select
  menuPortalTarget={mounted ? document.body : undefined}
  menuPosition="fixed"
/>
```
Apply the same guard in every react-select wrapper.

---

### 1.8 🔴 `constants/routes.js` — naming violates AGENTS Rule 1
**Where:** `constants/routes.js` (imported as `@/constants/routes`).

**Problem:** AGENTS Rule 1 table: *"Other files (util/api/types/schema/constants) → `kebab-case.<role>.ts` — e.g. `product.api.ts`, `booking.types.ts`."* So it must be `routes.constants.ts`. Same for `constants/enums.js` (empty!) and `constants/theme.js` (empty!).

**Fix:**
- Rename `constants/routes.js` → `constants/routes.constants.js`.
- Delete empty `constants/enums.js` and `constants/theme.js` (or fill them; see 4.4).
- Update every import.

---

### 1.9 🔴 `lib/entity-nav.js` breaks AGENTS Rule 3 (`lib/` is server-only)
**Where:** `lib/entity-nav.js` — starts with `"use client"` and uses `sessionStorage` and a React hook.

**Problem:** AGENTS Rule 3: *"`lib/` — server-only: `actions/` (mutations), `data/` (fetching), `auth.ts`."* A client helper cannot live here.

**Fix:** Move to `hooks/ui/use-nav-id.js` (helpers + hook) or split:
- `utils/entity-nav.js` — pure `stashNavId`/`readNavId`.
- `hooks/ui/use-nav-id.js` — the hook.

Then create the actual `lib/` structure the rules require:
```
lib/
  actions/            # server actions
  data/               # server fetchers
  auth.js             # server-side session helpers (readSession from cookies)
```

---

### 1.10 🔴 `AppProviders` imports `react-toastify` but the CSS is never loaded
**Where:** `components/common/AppProviders.jsx`.

**Problem:** `react-toastify` v11 requires `import "react-toastify/dist/ReactToastify.css"` for positioning/animation. Without it, the custom `<ToastCard>` still shows, but auto-hide progress, stacking transitions, and the container positioning are broken.

**Fix:**
```jsx
"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
```

---

### 1.11 🔴 `RouteProgressBar` uses `useSearchParams()` without a Suspense boundary
**Where:** `components/common/RouteProgressBar.jsx` (mounted somewhere at root once).

**Problem:** Next.js 15/16 requires any client component reading `useSearchParams()` to be wrapped in `<Suspense>`, otherwise **the entire route de-opts to full client rendering** (documented build-time warning; blocks static generation of `layout.tsx`).

**Fix:** Wrap the mount call:
```jsx
import { Suspense } from "react";
// inside AppProviders:
<Suspense fallback={null}><RouteProgressBar /></Suspense>
```

---

### 1.12 🔴 `Modal.jsx` corrupts `document.body.style.overflow` when 2 modals stack
**Where:** `components/common/Modal.jsx`.

**Problem:** Each modal on open sets `body.style.overflow = "hidden"`, and its cleanup resets it to `""`. Open modal A → open modal B → close B → body scroll is re-enabled while A is still open. Also no focus trap and no return focus to the trigger (a11y).

**Fix:** Reference-count the lock and add a small focus trap.
```jsx
let openModalCount = 0;
useEffect(() => {
  if (!open) return;
  openModalCount += 1;
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  const opener = document.activeElement;
  const onKey = (e) => { if (e.key === "Escape") onClose(); };
  document.addEventListener("keydown", onKey);
  return () => {
    document.removeEventListener("keydown", onKey);
    openModalCount -= 1;
    if (openModalCount === 0) document.body.style.overflow = prev;
    opener?.focus?.();
  };
}, [open, onClose]);
```


---

### 1.13 🔴 `config/env.js` — Zod validation is bypassed by the fallback pattern
**Where:** `config/env.js`.

**Problem:** After `envSchema.safeParse(...)`, the exported `ENV` reads `process.env.NEXT_PUBLIC_* ?? raw.NEXT_PUBLIC_*`. Since Next inlines `NEXT_PUBLIC_*` at build time, `process.env.NEXT_PUBLIC_*` is always a string — including the empty string — so the `??` fallback to the parsed default **never triggers**. Empty vars pass through unvalidated, and `parseInt("", 10)` yields `NaN` (page size).

**Fix:** Use only the parsed data.
```js
// config/env.js
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Real Estate ERP"),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1).default("0.1.0"),
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.coerce.number().int().positive().default(10),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().min(2).default("en-IN"),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().length(3).default("INR"),
  NEXT_PUBLIC_DEFAULT_DATE_FORMAT: z.string().min(1).default("dd/MM/yyyy"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().default(""),
  NEXT_PUBLIC_NOTIFICATION_SHOW_TIME_MS: z.coerce.number().int().positive().default(4000),
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
  sessionCookieName: raw.NEXT_PUBLIC_SESSION_COOKIE,
});
```

---

## 2. Major issues

### 2.1 🟠 Duplicate Pagination components (`Pagination.jsx` vs `CommonPagination.jsx`)
**Where:** `components/common/Pagination.jsx`, `components/common/CommonPagination.jsx`.

- AGENTS Rule 17: extract at the second duplicate, not carry two.
- `CommonPagination` also has bugs: `STANDARD_SIZES` inside the render, `useEffect` calls `setLimit(total)` on every render where `limit` isn't in the standard set (infinite re-render loop when the parent passes an arbitrary `limit`).

**Fix:** Delete `CommonPagination.jsx`. Keep the newer `Pagination.jsx` (with `buildPageList`). Update any importer.

---

### 2.2 🟠 Duplicate Filter components (`Filters.jsx` vs `FilterToolbar.jsx`)
**Where:** `components/common/Filters.jsx`, `components/common/FilterToolbar.jsx`.

Two components that both render "selects + reset". Pick one API and delete the other. `ListPageShell` already uses `FilterToolbar`, so:
- Keep `FilterToolbar`.
- Fold `Filters` search-input responsibility into the shared `SearchInput`.

---

### 2.3 🟠 Default exports everywhere — AGENTS Rule 10 requires named exports
**Where:** almost every file in `components/common/`, `hooks/`, `services/` (partial), `store/`, `schemas/`, `utils/format.js`.

**Problem:** AGENTS Rule 10: *"Named exports everywhere except Next.js `page`/`layout` (default)."*

**Fix:** Change `export default function Foo` to `export function Foo` (keep default in `app/*/page.js`, `app/layout.js`, `error.js`, `loading.js`, `not-found.js` only). Update the imports.

Example diff:
```diff
- export default function Button(...) { ... }
+ export function Button(...) { ... }

- import Button from "./Button";
+ import { Button } from "./Button";
```

---

### 2.4 🟠 `components/common/` mixes UI primitives, composed reusables, and feature-scoped shells
**Where:** `components/common/*`.

**Problem:** AGENTS Rule 3: *"`components/` — `ui/` (design-system primitives), `common/` (composed reusables), `features/<feature>/`."* Currently primitives (`Button`, `Modal`, `Icon`, `StatusBadge`, `SearchInput`, `LoadingSkeleton`, `Tabs`, `Stepper`, `OtpInput`, `EmptyState`, `Breadcrumb`, `Pagination`, all `*Field.jsx`) sit next to composed shells (`ListPageShell`, `FormPageLayout`, `BulkActionsRunner`, `BulkActiveToggle`, `CameraCaptureModal`, `KeyboardShortcutsGuide`, `ActiveFilterChips`, `column-helpers`).

**Fix (target layout — see section 5):**
```
components/
  ui/                      # dumb primitives
    Button.tsx
    Modal.tsx
    Icon.tsx
    StatusBadge.tsx
    LoadingSkeleton.tsx
    Tabs.tsx
    Stepper.tsx
    OtpInput.tsx
    EmptyState.tsx
    Breadcrumb.tsx
    Pagination.tsx
    SearchInput.tsx
    Skeleton.tsx
    ThemeToggle.tsx
    fields/                # every *Field.tsx + form primitives
  common/                  # composed reusables
    AppProviders.tsx
    ConfirmDialog.tsx
    DataTable.tsx
    ListPageShell.tsx
    FormPageLayout.tsx
    FormSection.tsx
    FormActions.tsx
    Filters.tsx
    FilterToolbar.tsx
    ActiveFilterChips.tsx
    BulkActionsRunner.tsx
    BulkActiveToggle.tsx
    CameraCaptureModal.tsx
    KeyboardShortcutsGuide.tsx
    MapView.tsx
    MapViewLazy.tsx
    RouteProgressBar.tsx
    ToastCard.tsx
    ColumnHelpers.tsx
  features/                # will be filled per module
  providers/
    QueryProvider.tsx
    AuthBootstrap.tsx
```


---

### 2.5 🟠 `hooks/auth/use-permission.js` — `hasPermission` is a fresh reference every render
Passing it as a prop cascades re-renders in memoized children.

**Fix:**
```js
import { useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ROLES } from "@/constants/roles.constants";

export function usePermission() {
  const role = useAuthStore((s) => s.user?.role);
  const permissions = useAuthStore((s) => s.permissions);

  const hasPermission = useCallback((action, resource) => {
    if (role === ROLES.SUPER_ADMIN) return true;
    return permissions.includes(`${String(resource).toLowerCase()}:${String(action).toLowerCase()}`);
  }, [role, permissions]);

  return { hasPermission };
}
```

Add a `<PermissionGate>` component so features don't inline the check every time:
```jsx
// components/common/PermissionGate.jsx
"use client";
import { usePermission } from "@/hooks/auth/use-permission";

export function PermissionGate({ action, resource, fallback = null, children }) {
  const { hasPermission } = usePermission();
  return hasPermission(action, resource) ? children : fallback;
}
```

---

### 2.6 🟠 Route protection at the layout level is missing (only middleware)
**Where:** `app/*`.

AGENTS Rule 4: *"middleware.ts at the edge + `(protected)/layout.tsx` re-validates server-side. Redirect — never render-then-hide."*

**Fix:** Create route groups.
```
app/
  (public)/
    layout.js                    # redirects signed-in users away
    login/page.js
    403/page.js
  (protected)/
    layout.js                    # server-side re-validate session + role
    dashboard/page.js
    projects/...
```

`app/(protected)/layout.js` outline:
```jsx
import { redirect } from "next/navigation";
import { readServerSession } from "@/lib/auth";
import { ROUTES } from "@/constants/routes.constants";

export default async function ProtectedLayout({ children }) {
  const session = await readServerSession();
  if (!session) redirect(`${ROUTES.login}?next=/dashboard`);
  return children;
}
```

---

### 2.7 🟠 No global `error.tsx`, `not-found.tsx`, `loading.tsx`
AGENTS Rule 16: *"Every data component handles loading / error / success explicitly. Error boundaries per major section."* Rule 14: *"Data routes need `loading.tsx`; failable routes need a Client `error.tsx` exposing `reset`."*

**Fix:** Add
- `app/loading.js` (or per-route)
- `app/error.js` (client component; shows fallback + `reset` button)
- `app/not-found.js`
- Same trio inside each `(protected)/<module>/` folder.

Skeleton `app/error.js`:
```jsx
"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }) {
  useEffect(() => { /* log to observability layer */ }, [error]);
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-h3 font-semibold">Something went wrong</h1>
        <p className="mt-2 text-small text-(--color-text-secondary)">{error.digest ?? error.message}</p>
        <Button onClick={reset} className="mt-4">Try again</Button>
      </div>
    </main>
  );
}
```

---

### 2.8 🟠 `services/` and `constants/` only cover Auth — nothing scales
**Where:** `constants/api-endpoints.constants.js`, `constants/query-keys.constants.js`, `services/`.

**Problem:** With only Auth wired, every new module will re-invent its own pattern.

**Fix (starter templates):**
```js
// constants/api-endpoints.constants.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login/",
    LOGOUT: "/auth/logout/",
    ME: "/auth/me/",
  },
  PROJECTS: {
    LIST: "/projects/",
    DETAIL: (id) => `/projects/${id}/`,
  },
  INVENTORY: {
    LIST: "/inventory/",
    DETAIL: (id) => `/inventory/${id}/`,
  },
  LEADS:      { LIST: "/leads/",      DETAIL: (id) => `/leads/${id}/` },
  CUSTOMERS:  { LIST: "/customers/",  DETAIL: (id) => `/customers/${id}/` },
  BOOKINGS:   { LIST: "/bookings/",   DETAIL: (id) => `/bookings/${id}/` },
  PAYMENTS:   { LIST: "/payments/",   DETAIL: (id) => `/payments/${id}/` },
  EMPLOYEES:  { LIST: "/employees/",  DETAIL: (id) => `/employees/${id}/` },
};
```

```js
// constants/query-keys.constants.js
export const QUERY_KEYS = {
  auth: {
    all: ["auth"],
    me:  () => [...QUERY_KEYS.auth.all, "me"],
  },
  projects: {
    all:    ["projects"],
    list:   (filters) => [...QUERY_KEYS.projects.all, "list", filters ?? {}],
    detail: (id)      => [...QUERY_KEYS.projects.all, "detail", id],
  },
  // repeat for inventory / leads / customers / bookings / payments / employees
};
```

Add one starter service per entity (e.g. `services/projects.api.js`) so devs copy that pattern.


---

### 2.9 🟠 `services/*.api.js` should transform casing automatically, not per-caller
**Where:** `services/auth.api.js` manually calls `parseApiData`/`keysToSnake`. Rule 5: *"Services transform BE casing (snake_case → camelCase)."*

**Fix:** Push the transformation into an axios interceptor so services stay slim:
```js
// services/api-client.js — add:
import { keysToCamel, keysToSnake } from "@/utils/case";

apiClient.interceptors.request.use((config) => {
  if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
    config.data = keysToSnake(config.data);
  }
  if (config.params && typeof config.params === "object") {
    config.params = keysToSnake(config.params);
  }
  return config;
});

apiClient.interceptors.response.use((res) => {
  res.data = res.data && typeof res.data === "object" ? keysToCamel(res.data) : res.data;
  return res;
});
```
Then services just call `apiPost(..., credentials)` and validate with Zod.

---

### 2.10 🟠 `Zustand` auth store isn't split into slices and doesn't invalidate the me-query on logout
**Where:** `store/auth.store.js`.

**Fix:**
- Split UI (`store/ui.store.js`) from Auth (`store/auth.store.js`) — Rule 7.
- Provide a `logout()` thunk that calls `logoutRequest()`, clears session, and `queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.all })`.
- Keep server data out (already ok).

```js
// store/auth.store.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,
  setSession: ({ user, permissions = [] }) => set({ user, permissions, isAuthenticated: !!user }),
  clearSession: () => set({ user: null, permissions: [], isAuthenticated: false }),
}));
```
Add a `useLogout()` hook in `hooks/auth/use-logout.js` that owns the `logoutRequest → clearSession → queryClient.clear` sequence.

---

### 2.11 🟠 Zod `userSchema.email().optional()` may not parse Django payloads that omit the field
**Where:** `services/auth.api.js`.

**Problem:** With Zod v4 the recommended way is `z.email().optional()`. If any field returns `null`, `.optional()` fails — use `.nullish()` for API tolerance.

**Fix:**
```js
export const userSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.email().nullish(),
  username: z.string().nullish(),
  fullName: z.string().nullish(),
  role: z.string().nullish(),
  permissions: z.array(z.string()).default([]),
});
```

---

### 2.12 🟠 `BrandLogo.jsx` uses raw `<img>` — AGENTS Rule 15 requires `next/image`
Also duplicating light/dark markup swells the DOM. Use Tailwind's `.dark:` class + a single `<Image>` per theme, or better: SVG-inline the logo.

**Fix:**
```jsx
import Image from "next/image";
export function BrandLogo({ className, priority }) {
  return (
    <>
      <Image src="/logo-light.png" alt={ENV.appName} width={440} height={154} priority={priority} className={cn("block dark:hidden w-auto object-contain", className)} />
      <Image src="/logo-dark.png"  alt={ENV.appName} width={440} height={154} priority={priority} className={cn("hidden dark:block w-auto object-contain", className)} />
    </>
  );
}
```

---

### 2.13 🟠 Too-fat prop APIs (Rule 10: max ~5 props)
Examples:
- `DataTable` — 13 props.
- `ListPageShell` — 30+ props.
- `SearchSelectField` — 12 props.
- `FormField` variants — 10–14 props.

**Fix:** Group into shape-props:
```ts
type ListPageShellProps<Row> = {
  page: PageHeaderConfig;
  filters?: FiltersConfig;
  search: SearchConfig;
  selection?: SelectionConfig;
  table: TableConfig<Row>;
  pagination: PaginationConfig;
};
```
Then features pass `page={...}`, `filters={...}`, etc.

---

### 2.14 🟠 `useState(() => new Date())` causes hydration mismatches
**Where:** `DateField.jsx`, `use-theme.jsx`.

`DateField` does `useState(() => typeof window === "undefined" ? null : new Date())` — server renders `null`, client renders a date → hydration warning at least, timezone drift at worst.

**Fix:** Use `useEffect` to set the client-only value after mount, or wrap the calendar popover in `mounted && ...`.

---

### 2.15 🟠 Random-id generation should be `crypto.randomUUID()`
`components/common/MultiFileUploadMock.jsx` uses `Math.random().toString(36).substring(7)` — collision-prone and not stable in Strict Mode.

**Fix:** `id: crypto.randomUUID()`.

---

### 2.16 🟠 No global Prettier / editor config → mixed formatting
Several files (`Icon.jsx`, `Button.jsx`, `FormField.jsx`, `DataTable.jsx`) are compressed one-line JSX; others are multi-line. Add `.prettierrc.json` + `prettier` dev-dep and format everything once.

---

### 2.17 🟠 `notify.jsx` overloaded signature is fragile
**Where:** `utils/notify.jsx`.

The polymorphic call site (`fallbackOrOptions` might be string or object) is error-prone without types. Convert to two clear signatures once TS lands.

---

### 2.18 🟠 `MapView.jsx` — `useJsApiLoader` per-instance and `google` used unchecked
- If two MapView instances mount, both call `useJsApiLoader` with the same `id`. Keep only one via `MapViewLazy`.
- Inside `onLoad`, `new google.maps.LatLngBounds()` — wrap in `try/catch` to survive partial script load.

Also add `libraries: []` explicitly to avoid loading `places` implicitly.
