import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,

  setSession: ({ user, permissions = [] }) =>
    set({
      user,
      permissions,
      isAuthenticated: !!user,
    }),

  clearSession: () =>
    set({
      user: null,
      permissions: [],
      isAuthenticated: false,
    }),
}));
