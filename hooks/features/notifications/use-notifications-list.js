"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys.constants";
import { fetchNotifications } from "@/services/notification.api";

export function useNotificationsList(filters, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(filters),
    queryFn: () => fetchNotifications(filters),
    ...options,
  });
}
