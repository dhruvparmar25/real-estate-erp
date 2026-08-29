"use client";

import { createStore } from "@/lib/mock-store";

const TENANT_ID = "tenant-re-erp";
const USER_ID = "user-admin";

const SEED_INAPP_NOTIFICATIONS = [
  {
    id: "inapp-1",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "booking_confirmed",
    title: "Booking Confirmed",
    message: "Booking #BK-1042 confirmed for Unit A-301 in Project Sunrise.",
    is_read: false,
    priority: "medium",
    reference_type: "booking",
    reference_id: "bk-1042",
    project_code: "SUN",
    project_name: "Project Sunrise",
    created_at: "2026-08-29T10:00:00Z",
    updated_at: "2026-08-29T10:00:00Z",
  },
  {
    id: "inapp-2",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "payment_due",
    title: "Payment Due",
    message: "Installment of ₹2,50,000 due for Project Sunrise — Tower A.",
    is_read: false,
    priority: "high",
    reference_type: "payment",
    reference_id: "pay-0089",
    project_code: "SUN",
    project_name: "Project Sunrise",
    created_at: "2026-08-29T08:15:00Z",
    updated_at: "2026-08-29T08:15:00Z",
  },
  {
    id: "inapp-3",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "lead_assigned",
    title: "Lead Assigned",
    message: "New lead assigned: Rajesh Patel — interested in 3BHK at Green Valley.",
    is_read: false,
    priority: "medium",
    reference_type: "lead",
    reference_id: "lead-4521",
    created_at: "2026-08-28T14:30:00Z",
    updated_at: "2026-08-28T14:30:00Z",
  },
  {
    id: "inapp-4",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "payment_received",
    title: "Payment Received",
    message: "Payment of ₹5,00,000 received from Priya Sharma for Unit B-204.",
    is_read: true,
    priority: "low",
    reference_type: "payment",
    reference_id: "pay-0085",
    created_at: "2026-08-28T09:15:00Z",
    updated_at: "2026-08-28T09:15:00Z",
  },
  {
    id: "inapp-5",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "project_update",
    title: "Project Update",
    message: "Phase 2 construction milestone reached at Green Valley Residency.",
    is_read: true,
    priority: "low",
    reference_type: "project",
    reference_id: "proj-green-valley",
    project_code: "GV",
    project_name: "Green Valley Residency",
    created_at: "2026-08-26T11:00:00Z",
    updated_at: "2026-08-26T11:00:00Z",
  },
  {
    id: "inapp-6",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "inventory_low",
    title: "Low Inventory Alert",
    message: "Only 3 units left in Tower B at Project Sunrise.",
    is_read: false,
    priority: "high",
    reference_type: "inventory",
    reference_id: "inv-tower-b",
    project_code: "SUN",
    project_name: "Project Sunrise",
    created_at: "2026-08-25T16:45:00Z",
    updated_at: "2026-08-25T16:45:00Z",
  },
  {
    id: "inapp-7",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "customer_registered",
    title: "New Customer KYC",
    message: "New customer KYC submitted by Amit Desai — pending verification.",
    is_read: true,
    priority: "medium",
    reference_type: "customer",
    reference_id: "cust-7821",
    created_at: "2026-08-22T10:00:00Z",
    updated_at: "2026-08-22T10:00:00Z",
  },
  {
    id: "inapp-8",
    tenant_id: TENANT_ID,
    user_id: USER_ID,
    event_type: "document_ready",
    title: "Document Ready",
    message: "Sale deed ready for signing — Booking #BK-1038, Unit C-102.",
    is_read: false,
    priority: "medium",
    reference_type: "booking",
    reference_id: "bk-1038",
    created_at: "2026-08-20T09:30:00Z",
    updated_at: "2026-08-20T09:30:00Z",
  },
];

export const inAppNotificationsStore = createStore(
  "inapp-notifications",
  SEED_INAPP_NOTIFICATIONS
);

export async function fetchNotifications(params = {}) {
  await new Promise((res) => setTimeout(res, 300));

  let all = inAppNotificationsStore.all();

  if (params.is_read !== undefined && params.is_read !== "") {
    const isRead = params.is_read === "true";
    all = all.filter((n) => n.is_read === isRead);
  }
  if (params.event_type) {
    all = all.filter((n) => n.event_type === params.event_type);
  }
  if (params.priority) {
    all = all.filter((n) => n.priority === params.priority);
  }
  if (params.created_after) {
    all = all.filter((n) => n.created_at >= params.created_after);
  }
  if (params.created_before) {
    all = all.filter((n) => n.created_at <= params.created_before);
  }
  if (params.project) {
    all = all.filter(
      (n) => n.reference_type === "project" && n.reference_id === params.project
    );
  }

  all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const page = parseInt(String(params.page ?? "1"), 10);
  const pageSize = parseInt(String(params.page_size ?? "10"), 10);
  const start = (page - 1) * pageSize;
  const results = all.slice(start, start + pageSize);

  return { count: all.length, results };
}

export async function fetchUnreadCount() {
  await new Promise((res) => setTimeout(res, 100));
  const all = inAppNotificationsStore.all();
  const unread = all.filter((n) => !n.is_read).length;
  return { unread };
}

export async function markNotificationRead(id) {
  await new Promise((res) => setTimeout(res, 150));
  const notif = inAppNotificationsStore.get(id);
  if (notif) {
    inAppNotificationsStore.update(id, { ...notif, is_read: true });
  }
  return { success: true };
}

export async function markAllNotificationsRead() {
  await new Promise((res) => setTimeout(res, 200));
  const all = inAppNotificationsStore.all();
  let markedCount = 0;
  for (const n of all) {
    if (!n.is_read) {
      inAppNotificationsStore.update(n.id, { ...n, is_read: true });
      markedCount++;
    }
  }
  return { marked_count: markedCount };
}

export async function deleteNotification(id) {
  await new Promise((res) => setTimeout(res, 150));
  inAppNotificationsStore.remove(id);
  return { success: true };
}

export const getNotifications = fetchNotifications;
export const getUnreadCount = fetchUnreadCount;
