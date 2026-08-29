export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login/",
    LOGOUT: "/auth/logout/",
    ME: "/auth/me/",
  },
  NOTIFICATIONS: {
    LIST: "/notifications/",
    UNREAD_COUNT: "/notifications/unread-count/",
    MARK_READ: (id) => `/notifications/${id}/read/`,
    MARK_ALL_READ: "/notifications/mark-all-read/",
    DELETE: (id) => `/notifications/${id}/`,
  },
  PROJECTS: {
    LIST: "/projects/",
    DETAIL: (id) => `/projects/${id}/`,
  },
  INVENTORY: {
    LIST: "/inventory/",
    DETAIL: (id) => `/inventory/${id}/`,
  },
  LEADS: {
    LIST: "/leads/",
    DETAIL: (id) => `/leads/${id}/`,
  },
  CUSTOMERS: {
    LIST: "/customers/",
    DETAIL: (id) => `/customers/${id}/`,
  },
  BOOKINGS: {
    LIST: "/bookings/",
    DETAIL: (id) => `/bookings/${id}/`,
  },
  PAYMENTS: {
    LIST: "/payments/",
    DETAIL: (id) => `/payments/${id}/`,
  },
  EMPLOYEES: {
    LIST: "/employees/",
    DETAIL: (id) => `/employees/${id}/`,
  },
};
