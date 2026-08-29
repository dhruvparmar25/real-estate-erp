"use client";

import { usePermission } from "@/hooks/auth/use-permission";

export function PermissionGate({ action, resource, fallback = null, children }) {
  const { hasPermission } = usePermission();
  return hasPermission(action, resource) ? children : fallback;
}
