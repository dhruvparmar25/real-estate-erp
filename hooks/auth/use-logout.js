"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { logoutAction } from "@/lib/actions/auth.actions";
import { QUERY_KEYS } from "@/constants/query-keys.constants";

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useCallback(async () => {
    clearSession();
    queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.all });
    await logoutAction();
  }, [clearSession, queryClient]);
}
