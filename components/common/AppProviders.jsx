"use client";

import { Suspense, useEffect } from "react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import RouteProgressBar from "@/components/common/RouteProgressBar";
import { ToastHost } from "@/components/common/ToastHost";
import { useUiStore } from "@/store/ui.store";

function ThemeSync({ initialTheme }) {
  useEffect(() => {
    const unsub = useUiStore.persist.onFinishHydration(() => {
      useUiStore.getState().setTheme(useUiStore.getState().theme);
    });
    useUiStore.getState().setTheme(initialTheme);
    return unsub;
  }, [initialTheme]);

  return null;
}

export function AppProviders({ children, initialTheme = "light" }) {
  return (
    <QueryProvider>
      <ThemeSync initialTheme={initialTheme} />
      <AuthBootstrap />
      {children}
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <ToastHost />
    </QueryProvider>
  );
}
