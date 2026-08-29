export const MOCK_USERS = [
  {
    id: "user-admin",
    username: "admin",
    email: "admin@realestate.local",
    fullName: "Admin User",
    role: "admin",
    roleDisplayName: "Administrator",
    permissions: ["*"],
  },
  {
    id: "user-sales",
    username: "sales",
    email: "sales@realestate.local",
    fullName: "Sales Manager",
    role: "sales_manager",
    roleDisplayName: "Sales Manager",
    permissions: ["leads.read", "leads.write", "customers.read", "bookings.read"],
  },
];

export const MOCK_CREDENTIALS = {
  admin: "Admin@123",
  sales: "Sales@123",
};

export function findMockUser(username) {
  const normalized = username.trim().toLowerCase();
  return MOCK_USERS.find((u) => u.username.toLowerCase() === normalized) ?? null;
}
