"use client";

import Button from "@/components/common/Button";

export default function GlobalError({ error, reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-(--color-bg)">
      <div className="max-w-md text-center">
        <h1 className="text-h3 font-semibold text-(--color-text-primary)">Something went wrong</h1>
        <p className="mt-2 text-small text-(--color-text-secondary)">
          {error.digest ?? error.message}
        </p>
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    </main>
  );
}
