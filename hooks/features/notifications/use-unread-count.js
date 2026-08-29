"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys.constants";
import { fetchUnreadCount } from "@/services/notification.api";

const POLL_INTERVAL_MS = 30_000;

export function useUnreadCount(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount(),
    queryFn: fetchUnreadCount,
    refetchInterval: POLL_INTERVAL_MS,
    ...options,
  });
}
