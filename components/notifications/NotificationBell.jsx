"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import { useMounted } from "@/hooks/use-mounted";
import { getEventConfig } from "./notificationHelpers";
import { ROUTES } from "@/constants/routes.constants";
import { useUnreadCount } from "@/hooks/features/notifications/use-unread-count";
import { useNotificationsList } from "@/hooks/features/notifications/use-notifications-list";
import { useNotificationMutations } from "@/hooks/features/notifications/use-notification-mutations";

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString();
}

export default function NotificationBell() {
  const router = useRouter();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: unreadData } = useUnreadCount();
  const unreadCount = mounted ? (unreadData?.unread ?? 0) : 0;

  const { data: listData, isLoading: loading } = useNotificationsList(
    { page_size: 10 },
    { enabled: open }
  );
  const notifications = listData?.results ?? [];

  const { markRead, markAllRead } = useNotificationMutations();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const handleClickNotification = (notif) => {
    if (!notif.is_read) handleMarkRead(notif.id);
    setOpen(false);
    router.push(ROUTES.notifications);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-full flex items-center justify-center text-(--color-text-primary) cursor-pointer hover:bg-(--color-bg) transition"
        suppressHydrationWarning
      >
        <Icon icon="mdi:bell-outline" width={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-(--color-danger) text-white text-tiny font-semibold border-2 border-(--color-surface) inline-flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-(--color-surface) border border-(--color-border) rounded-xl shadow-xl z-[100] flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-(--color-border) flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-(--color-text-primary)">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-(--color-primary)/10 text-(--color-primary) text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllRead.isPending}
                  className="text-[11px] text-(--color-primary) hover:underline font-medium disabled:opacity-50"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-3 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-(--color-text-secondary)">
                <Icon icon="mdi:bell-off-outline" width={40} className="mb-2 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = getEventConfig(notif.event_type);
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleClickNotification(notif)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-(--color-border) last:border-0 cursor-pointer transition hover:bg-(--color-bg) ${
                      !notif.is_read ? "bg-(--color-primary-soft)" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.bgClass || "bg-gray-100"}`}
                    >
                      <Icon icon={config.icon} width={18} className={config.colorClass || "text-gray-600"} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${!notif.is_read ? "font-semibold text-(--color-text-primary)" : "text-(--color-text-primary)"}`}
                        >
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-(--color-primary) shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-(--color-text-secondary) mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[11px] text-(--color-text-secondary) opacity-70">
                          {timeAgo(notif.created_at)}
                        </p>
                        {notif.project_code && (
                          <span
                            title={notif.project_name || notif.project_code}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-(--color-bg) text-(--color-text-primary) border border-(--color-border)"
                          >
                            <Icon icon="mdi:map-marker-outline" width={12} />
                            {notif.project_code}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-(--color-border) shrink-0">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push(ROUTES.notifications);
                }}
                className="w-full text-center text-sm text-(--color-primary) font-medium hover:underline"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
