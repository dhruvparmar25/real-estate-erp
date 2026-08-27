import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-bg) px-4">
      <div className="w-full max-w-md rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
        <h1 className="text-h3 font-semibold text-(--color-text-primary)">Sign in</h1>
        <p className="mt-2 text-small text-(--color-text-secondary)">
          Login form wires to <code className="text-tiny">services/auth.api.js</code> when
          the backend is ready.
        </p>
        <p className="mt-4 text-tiny text-(--color-text-tertiary)">
          After the session cookie is set, open{" "}
          <Link className="text-(--color-primary) underline" href={ROUTES.dashboard}>
            dashboard
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
