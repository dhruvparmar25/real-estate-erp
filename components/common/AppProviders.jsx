"use client";

import { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import RouteProgressBar from "@/components/common/RouteProgressBar";
import { ENV } from "@/config/env";
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
  const { toast } = ENV;

  return (
    <QueryProvider>
      <ThemeSync initialTheme={initialTheme} />
      <AuthBootstrap />
      {children}
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <ToastContainer
        position={toast.position}
        newestOnTop
        closeButton={false}
        icon={false}
        closeOnClick={false}
        draggable={false}
        limit={toast.limit}
        style={{ top: toast.offsetTop, right: toast.offsetRight, width: "auto" }}
        toastStyle={{
          padding: 0,
          background: "transparent",
          boxShadow: "none",
          minHeight: "unset",
        }}
      />
    </QueryProvider>
  );
}
