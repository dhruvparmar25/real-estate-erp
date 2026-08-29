"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Icon } from "@/components/common/Icon";
import Pagination from "@/components/common/Pagination";
import { useMounted } from "@/hooks/use-mounted";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import StatusBadge from "@/components/common/StatusBadge";
import {
  getEventConfig,
  getPriorityTone,
  getNotificationRoute,
  buildNotificationNavArgs,
  EVENT_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  PROJECT_OPTIONS,
} from "@/components/notifications/notificationHelpers";
import { useNotificationsList } from "@/hooks/features/notifications/use-notifications-list";
import { useUnreadCount } from "@/hooks/features/notifications/use-unread-count";
import { useNotificationMutations } from "@/hooks/features/notifications/use-notification-mutations";
import { notifySuccess, notifyError } from "@/utils/notify";

function getSelectStyles(minWidth) {
  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--color-surface)",
      minHeight: "32px",
      minWidth,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-border)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : "none",
      fontSize: "0.75rem",
      "&:hover": { borderColor: "var(--color-primary)" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--color-surface)",
      borderRadius: "0.5rem",
      border: "1px solid var(--color-border)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 50,
    }),
    menuList: (base) => ({ ...base, maxHeight: "200px" }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.75rem",
      backgroundColor: state.isSelected
        ? "var(--color-primary)"
        : state.isFocused
          ? "var(--color-surface-muted)"
          : "transparent",
      color: state.isSelected ? "var(--color-primary-fg)" : "var(--color-text-primary)",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--color-text-primary)",
      fontSize: "0.75rem",
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "0.75rem",
      color: "var(--color-text-secondary)",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    indicatorSeparator: () => ({ display: "none" }),
  };
}

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getDateGroup(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  if (d >= today) return "Today";
  if (d >= yesterday) return "Yesterday";
  if (d >= weekAgo) return "This Week";
  return "Earlier";
}

function groupByDate(notifications) {
  const groups = {};
  for (const n of notifications) {
    const group = getDateGroup(n.created_at);
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }
  return groups;
}

export default function NotificationsClient() {
  const router = useRouter();
  const mounted = useMounted();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterRead, setFilterRead] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const listFilters = useMemo(() => {
    const params = { page, page_size: limit };
    if (filterRead !== "") params.is_read = filterRead;
    if (filterType) params.event_type = filterType;
    if (filterPriority) params.priority = filterPriority;
    if (filterProject) params.project = filterProject;
    if (dateRange.from) params.created_after = new Date(dateRange.from).toISOString();
    if (dateRange.to) params.created_before = `${dateRange.to}T23:59:59`;
    return params;
  }, [page, limit, filterRead, filterType, filterPriority, filterProject, dateRange]);

  const { data: listData, isLoading: loading, isError } = useNotificationsList(listFilters);
  const { data: unreadData } = useUnreadCount();

  const notifications = listData?.results ?? [];
  const total = listData?.count ?? 0;
  const unreadTotal = unreadData?.unread ?? 0;

  const { markRead, markAllRead, remove } = useNotificationMutations();

  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: (data) => {
        notifySuccess(`${data.marked_count} notifications marked as read`);
      },
      onError: () => notifyError("Failed to mark all as read"),
    });
  };

  const handleDelete = (id) => {
    remove.mutate(id, {
      onSuccess: () => notifySuccess("Notification deleted successfully"),
      onError: () => notifyError("Failed to delete notification"),
    });
  };

  const handleClick = (notif) => {
    if (!notif.is_read) handleMarkRead(notif.id);
    router.push(buildNotificationNavArgs(notif));
  };

  const clearFilters = () => {
    setFilterRead("");
    setFilterType("");
    setFilterPriority("");
    setFilterProject("");
    setDateRange({ from: "", to: "" });
    setPage(1);
  };

  const hasFilters =
    filterRead !== "" ||
    filterType ||
    filterPriority ||
    filterProject ||
    dateRange.from ||
    dateRange.to;
  const unreadInView = notifications.filter((n) => !n.is_read).length;
  const readInView = notifications.filter((n) => n.is_read).length;
  const readCount = hasFilters ? readInView : Math.max(0, total - unreadTotal);
  const grouped = groupByDate(notifications);
  const groupOrder = ["Today", "Yesterday", "This Week", "Earlier"];
  const highPriorityCount = notifications.filter((n) => {
    const c = getEventConfig(n.event_type);
    return c.priority === "high" && !n.is_read;
  }).length;

  if (isError) {
    return (
      <div className="pb-6 w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-20 text-(--color-text-secondary)">
        <Icon icon="mdi:alert-circle-outline" width={40} className="mb-2 text-(--color-danger)" />
        <p className="text-sm font-semibold">Failed to load notifications</p>
      </div>
    );
  }

  return (
    <div className="pb-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text-primary)">Notifications</h1>
          <p className="text-sm text-(--color-text-secondary)">
            Stay updated with system alerts and activities
          </p>
        </div>

        {unreadTotal > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-primary) text-white text-sm shrink-0 hover:opacity-90 transition disabled:opacity-50"
          >
            <Icon icon="mdi:check-all" width={16} />
            Mark All Read ({unreadTotal})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard icon="mdi:bell-ring-outline" label="Total" value={total} tone="info" />
        <StatCard
          icon="mdi:email-outline"
          label="Unread"
          value={hasFilters ? unreadInView : unreadTotal}
          tone="danger"
        />
        <StatCard icon="mdi:check-circle-outline" label="Read" value={readCount} tone="success" />
        <StatCard
          icon="mdi:alert-circle-outline"
          label="High Priority"
          value={highPriorityCount}
          tone="warning"
        />
      </div>

      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-(--color-bg) rounded-lg p-1">
          {[
            { value: "", label: "All", icon: "mdi:format-list-bulleted" },
            { value: "false", label: "Unread", icon: "mdi:email-outline" },
            { value: "true", label: "Read", icon: "mdi:email-open-outline" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFilterRead(opt.value);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                filterRead === opt.value
                  ? "bg-(--color-primary) text-white shadow-sm"
                  : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
              }`}
            >
              <Icon icon={opt.icon} width={14} />
              {opt.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-(--color-border) hidden sm:block" />

        <Select
          instanceId="notifications-filter-type"
          options={EVENT_TYPE_OPTIONS}
          value={EVENT_TYPE_OPTIONS.find((o) => o.value === filterType) || null}
          onChange={(opt) => {
            setFilterType(opt ? opt.value : "");
            setPage(1);
          }}
          isClearable
          isSearchable
          placeholder="All Types"
          menuPortalTarget={mounted ? document.body : undefined}
          menuPlacement="auto"
          styles={getSelectStyles("180px")}
        />

        <div className="h-6 w-px bg-(--color-border) hidden sm:block" />

        <Select
          instanceId="notifications-filter-priority"
          options={PRIORITY_OPTIONS}
          value={PRIORITY_OPTIONS.find((o) => o.value === filterPriority) || null}
          onChange={(opt) => {
            setFilterPriority(opt ? opt.value : "");
            setPage(1);
          }}
          isClearable
          placeholder="All Priority"
          menuPortalTarget={mounted ? document.body : undefined}
          menuPlacement="auto"
          styles={getSelectStyles("150px")}
        />

        <div className="h-6 w-px bg-(--color-border) hidden sm:block" />

        <Select
          instanceId="notifications-filter-project"
          options={PROJECT_OPTIONS}
          value={PROJECT_OPTIONS.find((o) => o.value === filterProject) || null}
          onChange={(opt) => {
            setFilterProject(opt ? opt.value : "");
            setPage(1);
          }}
          isClearable
          isSearchable
          placeholder="All Projects"
          menuPortalTarget={mounted ? document.body : undefined}
          menuPlacement="auto"
          styles={getSelectStyles("160px")}
        />

        <DateRangeFilter
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);
            setPage(1);
          }}
        />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-(--color-primary) hover:underline"
          >
            <Icon icon="mdi:close-circle-outline" width={14} />
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl flex flex-col items-center justify-center py-20 text-(--color-text-secondary)">
          <div className="w-16 h-16 rounded-full bg-(--color-bg) flex items-center justify-center mb-4">
            <Icon icon="mdi:bell-check-outline" width={32} className="opacity-40" />
          </div>
          <p className="text-sm font-semibold">
            {hasFilters ? "No matching notifications" : "All caught up!"}
          </p>
          <p className="text-xs mt-1 opacity-70">
            {hasFilters
              ? "Try adjusting your filters to see more"
              : "You have no notifications at the moment"}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-xs text-(--color-primary) font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groupOrder.map((groupName) => {
            const items = grouped[groupName];
            if (!items?.length) return null;

            return (
              <div key={groupName}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
                    {groupName}
                  </span>
                  <div className="flex-1 h-px bg-(--color-border)" />
                  <span className="text-[11px] text-(--color-text-secondary)">
                    {items.length} {items.length === 1 ? "notification" : "notifications"}
                  </span>
                </div>

                <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden divide-y divide-(--color-border)">
                  {items.map((notif) => (
                    <NotificationRow
                      key={notif.id}
                      notif={notif}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                      onClick={handleClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {total > 0 && (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={Math.ceil(total / limit) || 1}
            total={total}
            pageSize={limit}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setLimit(size);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, tone }) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-4 py-3 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 tone-${tone}-bg`}>
        <Icon icon={icon} width={20} className={`tone-${tone}-fg`} />
      </div>
      <div>
        <p className="text-xl font-bold text-(--color-text-primary) leading-none">{value}</p>
        <p className="text-[11px] text-(--color-text-secondary) mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function NotificationRow({ notif, onMarkRead, onDelete, onClick }) {
  const config = getEventConfig(notif.event_type);
  const tone = getPriorityTone(config.priority);
  const hasLink = Boolean(
    (notif.reference_type && notif.reference_id) || getNotificationRoute(notif.event_type)
  );

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 transition group ${
        !notif.is_read
          ? "bg-gradient-to-r from-(--color-primary-soft) to-transparent border-l-3 border-l-(--color-primary)"
          : "hover:bg-(--color-bg) border-l-3 border-transparent"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.bgClass || "bg-gray-100"}`}
      >
        <Icon icon={config.icon} width={18} className={config.colorClass || "text-gray-600"} />
      </div>

      <div
        className={`flex-1 min-w-0 ${hasLink ? "cursor-pointer" : ""}`}
        onClick={() => hasLink && onClick(notif)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p
                className={`text-sm leading-snug ${!notif.is_read ? "font-semibold" : ""} text-(--color-text-primary)`}
              >
                {notif.title}
              </p>
              {!notif.is_read && (
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shrink-0" />
              )}
            </div>
            <p className="text-xs text-(--color-text-secondary) mt-0.5 line-clamp-1">{notif.message}</p>
          </div>
          <span className="text-[11px] text-(--color-text-secondary) whitespace-nowrap shrink-0 mt-0.5">
            {timeAgo(notif.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <StatusBadge tone={tone}>{config.priority} Priority</StatusBadge>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-(--color-surface-muted) text-(--color-text-secondary) border border-(--color-border)">
            {config.category}
          </span>
          {hasLink && (
            <span className="text-[10px] text-(--color-primary) font-medium hover:underline">
              View details →
            </span>
          )}

          <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
            {!notif.is_read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notif.id);
                }}
                title="Mark as read"
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-(--color-primary)/10 transition"
              >
                <Icon icon="mdi:check" width={14} className="text-(--color-primary)" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notif.id);
              }}
              title="Delete"
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 transition"
            >
              <Icon icon="mdi:trash-can-outline" width={14} className="text-gray-400 group-hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
