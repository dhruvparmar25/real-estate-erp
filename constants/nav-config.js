import { ROUTES } from "@/constants/routes.constants";

export const NAV_CONFIG = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: ROUTES.dashboard, icon: "mdi:view-dashboard-outline" },
      { label: "Projects", path: ROUTES.projects, icon: "mdi:office-building-outline" },
      { label: "Inventory", path: ROUTES.inventory, icon: "mdi:package-variant-closed" },
      { label: "Leads", path: ROUTES.leads, icon: "mdi:account-search-outline" },
      { label: "Customers", path: ROUTES.customers, icon: "mdi:account-group-outline" },
      { label: "Bookings", path: ROUTES.bookings, icon: "mdi:clipboard-check-outline" },
      { label: "Payments", path: ROUTES.payments, icon: "mdi:cash-multiple" },
      { label: "Employees", path: ROUTES.employees, icon: "mdi:account-tie-outline" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notifications", path: ROUTES.notifications, icon: "mdi:bell-outline" },
    ],
  },
];
