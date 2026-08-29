import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-bg) px-4">
      <div className="text-center">
        <h1 className="text-h2 font-semibold text-(--color-text-primary)">Page not found</h1>
        <p className="mt-2 text-small text-(--color-text-secondary)">
          The page you are looking for does not exist.
        </p>
        <Link
          href={ROUTES.dashboard}
          className="mt-4 inline-block text-small font-medium text-(--color-primary) underline"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
