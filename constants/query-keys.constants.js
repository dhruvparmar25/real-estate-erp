export const QUERY_KEYS = {
  auth: {
    all: ["auth"],
    me: () => [...QUERY_KEYS.auth.all, "me"],
  },
  notifications: {
    all: ["notifications"],
    list: (filters = {}) => [...QUERY_KEYS.notifications.all, "list", filters],
    unreadCount: () => [...QUERY_KEYS.notifications.all, "unread-count"],
  },
  projects: {
    all: ["projects"],
    list: (filters) => [...QUERY_KEYS.projects.all, "list", filters ?? {}],
    detail: (id) => [...QUERY_KEYS.projects.all, "detail", id],
  },
  inventory: {
    all: ["inventory"],
    list: (filters) => [...QUERY_KEYS.inventory.all, "list", filters ?? {}],
    detail: (id) => [...QUERY_KEYS.inventory.all, "detail", id],
  },
  leads: {
    all: ["leads"],
    list: (filters) => [...QUERY_KEYS.leads.all, "list", filters ?? {}],
    detail: (id) => [...QUERY_KEYS.leads.all, "detail", id],
  },
  customers: {
    all: ["customers"],
    list: (filters) => [...QUERY_KEYS.customers.all, "list", filters ?? {}],
    detail: (id) => [...QUERY_KEYS.customers.all, "detail", id],
  },
  bookings: {
    all: ["bookings"],
    list: (filters) => [...QUERY_KEYS.bookings.all, "list", filters ?? {}],
    detail: (id) => [...QUERY_KEYS.bookings.all, "detail", id],
  },
  payments: {
    all: ["payments"],
    list: (filters) => [...QUERY_KEYS.payments.all, "list", filters ?? {}],
    detail: (id) => [...QUERY_KEYS.payments.all, "detail", id],
  },
  employees: {
    all: ["employees"],
    list: (filters) => [...QUERY_KEYS.employees.all, "list", filters ?? {}],
    detail: (id) => [...QUERY_KEYS.employees.all, "detail", id],
  },
};
