"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSessionUser } from "@/lib/actions/auth.actions";
import { QUERY_KEYS } from "@/constants/query-keys.constants";
import { useAuthStore } from "@/store/auth.store";

export function AuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const { data, isSuccess, isError } = useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: () => getSessionUser(),
    staleTime: 5 * 60_000,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data?.user) {
      setSession({ user: data.user, permissions: data.permissions ?? [] });
    }
    if (isSuccess && !data?.user) clearSession();
    if (isError) clearSession();
  }, [isSuccess, isError, data, setSession, clearSession]);

  return null;
}
