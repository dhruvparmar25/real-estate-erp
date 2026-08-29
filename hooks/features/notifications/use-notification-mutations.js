"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys.constants";
import {
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/services/notification.api";

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const invalidateNotifications = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidateNotifications,
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidateNotifications,
  });

  const remove = useMutation({
    mutationFn: deleteNotification,
    onSuccess: invalidateNotifications,
  });

  return { markRead, markAllRead, remove };
}
