import { ROUTES } from "@/constants/routes.constants";

const EVENT_CONFIG = {
  booking_confirmed: {
    icon: "mdi:clipboard-check-outline",
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    priority: "medium",
    label: "Booking Confirmed",
    category: "Bookings",
  },
  payment_due: {
    icon: "mdi:cash-clock",
    colorClass: "text-red-600",
    bgClass: "bg-red-50",
    priority: "high",
    label: "Payment Due",
    category: "Payments",
  },
  payment_received: {
    icon: "mdi:cash-check",
    colorClass: "text-green-600",
    bgClass: "bg-green-50",
    priority: "low",
    label: "Payment Received",
    category: "Payments",
  },
  lead_assigned: {
    icon: "mdi:account-arrow-right-outline",
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    priority: "medium",
    label: "Lead Assigned",
    category: "Leads",
  },
  project_update: {
    icon: "mdi:office-building-outline",
    colorClass: "text-purple-600",
    bgClass: "bg-purple-50",
    priority: "low",
    label: "Project Update",
    category: "Projects",
  },
  inventory_low: {
    icon: "mdi:package-variant-closed-minus",
    colorClass: "text-red-600",
    bgClass: "bg-red-50",
    priority: "high",
    label: "Low Inventory",
    category: "Inventory",
  },
  customer_registered: {
    icon: "mdi:account-plus-outline",
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    priority: "medium",
    label: "Customer Registered",
    category: "Customers",
  },
  document_ready: {
    icon: "mdi:file-document-outline",
    colorClass: "text-green-600",
    bgClass: "bg-green-50",
    priority: "medium",
    label: "Document Ready",
    category: "Bookings",
  },
};

const EVENT_ROUTE_MAP = {
  booking_confirmed: ROUTES.bookings,
  payment_due: ROUTES.payments,
  payment_received: ROUTES.payments,
  lead_assigned: ROUTES.leads,
  project_update: ROUTES.projects,
  inventory_low: ROUTES.inventory,
  customer_registered: ROUTES.customers,
  document_ready: ROUTES.bookings,
};

const DEFAULT_CONFIG = {
  icon: "mdi:bell-outline",
  colorClass: "text-gray-600",
  bgClass: "bg-gray-100",
  priority: "low",
  label: "Notification",
  category: "General",
};

export function getNotificationRoute(eventType) {
  return EVENT_ROUTE_MAP[eventType] || null;
}

export function buildNotificationNavArgs(notif) {
  const basePath = EVENT_ROUTE_MAP[notif.event_type];
  if (!basePath) return ROUTES.notifications;

  if (notif.reference_id) {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}focusId=${notif.reference_id}`;
  }

  return basePath;
}

export function getEventConfig(eventType) {
  return EVENT_CONFIG[eventType] || DEFAULT_CONFIG;
}

export function getPriorityTone(priority) {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    default:
      return "info";
  }
}

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_CONFIG).map(([key, val]) => ({
  value: key,
  label: val.label,
}));

export const PRIORITY_OPTIONS = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

export const PROJECT_OPTIONS = [
  { value: "proj-sunrise", label: "Project Sunrise" },
  { value: "proj-green-valley", label: "Green Valley Residency" },
  { value: "proj-skyline", label: "Skyline Heights" },
];
