"use client";

import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/hooks/use-theme";
import { QueryProvider } from "@/components/providers/QueryProvider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <ToastContainer
          position="top-right"
          newestOnTop
          closeOnClick={false}
          draggable={false}
          limit={4}
        />
      </QueryProvider>
    </ThemeProvider>
  );
}
