import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-bg) px-4">
      <div className="w-full max-w-md rounded-xl border border-(--color-border) bg-(--color-surface) p-6 text-center">
        <h1 className="text-h3 font-semibold text-(--color-text-primary)">403 — Forbidden</h1>
        <p className="mt-2 text-small text-(--color-text-secondary)">
          You do not have permission to view this page.
        </p>
        <Link
          className="mt-4 inline-block text-small font-medium text-(--color-primary) underline"
          href={ROUTES.dashboard}
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
