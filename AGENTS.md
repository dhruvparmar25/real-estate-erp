# AGENTS.md — Frontend Rules (Next.js Web)

> Read this before writing any code. Every rule applies to every file and every PR.
> **[Next.js]** = App Router only. Unlabeled rules apply to all React code.

---

## 1. Naming Conventions

- Names reveal intent. No abbreviations, no vague names (`data`, `info`, `temp`, `handler`).
- No underscore prefixes. Unexported helpers still get real names: `buildFilterQuery`.
- One responsibility per file — UI, hook, or util. Never mix.

| What | Convention | Example |
|---|---|---|
| Component files & identifiers | `PascalCase` | `ProductCard.tsx`, `ProductCard` |
| Hook files & identifiers | `use-kebab-case.ts`, `useX` | `use-pagination.ts`, `usePagination` |
| Other files (util/api/types/schema/constants) | `kebab-case.<role>.ts` | `product.api.ts`, `booking.types.ts` |
| Functions & variables | `camelCase` | `fetchProducts` |
| Types & interfaces | `PascalCase` | `Product`, `ApiResponse<T>` |
| Constants (value) | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |
| Route folders **[Next.js]** | `kebab-case` | `pooja-kits/` |

---

## 2. Comments

- Comment only the non-obvious **why**: a hidden constraint, browser quirk, or workaround (+ issue link).
- One short English line. No block comments, no JSDoc. Never restate what the code does.

---

## 3. Project Structure

Flat and predictable — one clear job per folder. **[Next.js App Router]**

- `app/` — routes; Server Components by default. `(public)/` and `(protected)/` route groups; each data route has `loading.tsx` + `error.tsx`.
- `components/` — `ui/` (design-system primitives), `common/` (composed reusables), `features/<feature>/` (feature-scoped UI). No business logic here.
- `hooks/` — organized by concern: `auth/`, `ui/`, `features/<feature>/`.
- `lib/` — server-only: `actions/` (mutations), `data/` (fetching), `auth.ts`.
- `services/` — client API modules: `api-client.ts` + one `<entity>.api.ts` per entity.
- `store/` — Zustand global UI state only (`auth.store.ts`, `ui.store.ts`). No server data.
- `types/`, `schemas/` (Zod), `constants/` — shared definitions. No magic strings outside `constants/`.
- `config/env.ts` — read + validate all env vars. `middleware.ts` — edge auth/RBAC guard. `public/` — static assets.

---

## 4. RBAC

- Roles in `constants/roles.constants.ts`, permissions in `constants/permissions.constants.ts` (`PERMISSIONS.<RESOURCE>.<ACTION>`). Never raw role strings in components.
- All checks go through `hooks/auth/use-permission.ts` → `hasPermission(action, resource)`, reading the auth store (no refetch per call).
- Gate routes: `middleware.ts` at the edge + `(protected)/layout.tsx` re-validates server-side. Redirect — never render-then-hide.
- Gate UI with `hasPermission` — a user who can't act never sees the action. Design read-only views explicitly.
- Frontend RBAC is UX only; the API always re-authorizes. Never check permissions in `services/`, never store them in `localStorage`.

---

## 5. API Client & Service Layer

- One Axios instance in `services/api-client.ts`: `baseURL` from `config/env.ts`, token via request interceptor, 401→login / 403→/403 via response interceptor.
- One typed service file per entity. Functions return typed, Zod-parsed data — never raw Axios responses, never inline `axios.*` in components/hooks.
- Services transform BE casing (snake_case → camelCase). Loading/error state is TanStack Query's job, not the service's.

---

## 6. Data Fetching — TanStack Query

- All client-side fetching uses TanStack Query — never `useEffect + fetch`.
- Query keys come from `constants/query-keys.constants.ts` — never inline strings.
- Feature hooks wrap `useQuery`/`useMutation`; components never call them directly.
- Mutations call `invalidateQueries` on success. Set global `staleTime` / `gcTime` / `retry` defaults.
- **[Next.js]** Server Components fetch in `lib/data/` with async/await; Client Components use Query. Don't mix in one component.

---

## 7. State Management

| State type | Lives in | Example |
|---|---|---|
| Local UI | `useState` / `useReducer` | modal open, input focus |
| Server / async | TanStack Query | product list, booking detail |
| Global client | Zustand | logged-in user, theme, cart |
| URL / navigation | URL search params | filters, pagination, active tab |
| Form | React Hook Form | fields, validation errors |

- Never store derived state — compute it (`useMemo` only if expensive).
- Never put server data in Zustand. Split stores by domain.
- Use URL params for shareable/bookmarkable state.

---

## 8. Server vs Client Components **[Next.js]**

- Server by default. Add `'use client'` only for browser APIs, React hooks, event handlers, or subscriptions.
- Server at the top, client at the leaves — push `'use client'` to the smallest interactive island.
- Never import a Server Component into a Client Component — pass it as `children`.

---

## 9. Environment & Configuration

- All env values read once in `config/env.ts`, validated with Zod (missing required → throw at startup). `process.env` is accessed nowhere else.
- **[Next.js]** `NEXT_PUBLIC_` only for browser-safe values; secrets stay server-side.
- Add every new key to `.env.example`. Never commit secrets.

---

## 10. Component Design

- One responsibility per component — split if it does two things.
- Always a typed `Props` (no `any`, no inline anonymous types). Max ~5 props — group or rethink beyond that.
- No business logic in components — that lives in hooks/utils.
- Prefer early returns over nested ternaries. Stable unique `key` in lists, never the array index.
- Named exports everywhere except Next.js `page`/`layout` (default).

---

## 11. Re-render & Memory

- Profile before memoizing. `React.memo` / `useMemo` / `useCallback` only where profiling shows a real, expensive re-render.
- Define static objects/constants at module scope. Never pass inline objects/arrays as props to memoized children.
- Always clean up effects that set timers, subscriptions, or listeners.
- **[React 19 + Compiler]** Drop manual memoization the compiler handles.

---

## 12. TypeScript

- No `any` — use `unknown` + narrow. `@ts-expect-error` needs a reason + issue link.
- `strict: true`, always. Explicit parameter and return types.
- `interface` for extendable shapes, `type` for unions/intersections. Meaningful generics (`TData`, not `T`).
- `as const` for constant literals. Co-locate types; share via `types/`.

---

## 13. Forms & Validation

- React Hook Form for every form (never per-field `useState`); logic in `hooks/features/<entity>/use-<entity>-form.ts`.
- Zod schema in `schemas/<entity>.schema.ts` is the single validation source — shared by form and service.
- Every field has a `<label>` (not placeholder-as-label). Disable submit while `isSubmitting`.
- Show field-level errors inline; map API field errors back via `setError`.

---

## 14. Routing & Navigation **[Next.js]**

- Internal navigation via `<Link />`, never `<a href>`. `router.push()` only for post-mutation programmatic nav.
- Use `ROUTES` constants from `constants/routes.constants.ts` — never hardcode paths.
- Data routes need `loading.tsx`; failable routes need a Client `error.tsx` exposing `reset`.

---

## 15. Performance

- Code-split heavy client-only libs (editors, charts, maps) with `next/dynamic`. Import named exports only, never whole libraries.
- **[Next.js]** Images via `next/image` with `width`/`height`/`alt`; `priority` only above the fold.
- Targets (regression blocks release): LCP < 2.5s, INP < 200ms, CLS < 0.1. Verify with Lighthouse + `next build`.

---

## 16. Error & Loading States

- Every data component handles loading / error / success explicitly.
- `Skeleton` for loading, `EmptyState` for empty lists — never blank space.
- Error boundaries per major section. Log errors to the observability layer (not `console.error`); show a readable message + retry.

---

## 17. Reuse

- Same UI in 2+ places → `components/common/` or `ui/`. Same logic in 2+ places → `hooks/` or `utils/`.
- At the third duplicate: stop, extract first, then continue.
- Compose small focused components over one mega-component with many props and branches.

---

## 18. Security

- Never store tokens or PII in `localStorage` / `sessionStorage` — use `httpOnly` cookies.
- Never feed user input to `dangerouslySetInnerHTML`. Validate user input with Zod before any API/URL/render use.
- External links use `rel="noopener noreferrer"`.
- **[Next.js]** Server Actions re-authorize before mutating. Never expose secrets in client code or `NEXT_PUBLIC_` vars.

---

## 19. Design Tokens & Theming — Project Rule

- Source of truth: `Docs/ecommerce-ui-planning.md` → wired into `app/globals.css` `@theme` (Tailwind v4). Never hardcode hex colors, font names, or spacing in components.
- Brand palette: Maroon `#6B1A1A` (primary), Gold `#C99A28` (accent), Saffron `#E8650A` (CTA), Cream `#FDFAF5` (surface). Reference via `var(--color-*)` or Tailwind token classes.
- Fonts: Philosopher (display), Inter (body), Cinzel (accent caps), JetBrains Mono (prices/IDs) — loaded once in `layout.tsx` via `next/font`.
- Dark mode toggles the `.dark` class on `<html>` (driven by `store/ui.store.ts`); every color must be defined for both modes.

---

## 20. Payments & SEO — Project Rule

- **Payments:** Handled **entirely by the backend (Django)** — no payment SDK or keys live on the frontend. The FE only calls backend endpoints to start/confirm a payment and renders the returned state; it never talks to a payment gateway directly and never holds gateway secrets. CAP (Cash After Pooja) is a first-class payment method alongside online.
- **SEO:** Every route exports `metadata` (title/description/Open Graph). Product/pandit pages add JSON-LD structured data. Maintain `sitemap.ts` + `robots.ts`. Analytics events (GA/Meta Pixel) fire through one wrapper, gated on cookie consent.
