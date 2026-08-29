"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ROLES } from "@/constants/roles.constants";

export function usePermission() {
  const role = useAuthStore((s) => s.user?.role);
  const permissions = useAuthStore((s) => s.permissions);

  const hasPermission = useCallback(
    (action, resource) => {
      if (role === ROLES.SUPER_ADMIN) return true;
      return permissions.includes(
        `${String(resource).toLowerCase()}:${String(action).toLowerCase()}`
      );
    },
    [role, permissions]
  );

  return { hasPermission };
}
