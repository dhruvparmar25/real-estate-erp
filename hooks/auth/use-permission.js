"use client";

import { useAuthStore } from "@/store/auth.store";
import { ROLES } from "@/constants/roles.constants";

export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions);
  const user = useAuthStore((state) => state.user);

  function hasPermission(action, resource) {
    if (user?.role === ROLES.SUPER_ADMIN) return true;
    const key = `${String(resource).toLowerCase()}:${String(action).toLowerCase()}`;
    return permissions.includes(key);
  }

  return { hasPermission };
}
