import { z } from "zod";
import { apiGet, apiPost } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints.constants";

export const userSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.string().email().nullish(),
  username: z.string().nullish(),
  fullName: z.string().nullish(),
  role: z.string().nullish(),
  permissions: z.array(z.string()).default([]),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  permissions: z.array(z.string()).optional(),
});

export async function loginRequest(credentials) {
  const data = await apiPost(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return loginResponseSchema.parse(data);
}

export async function logoutRequest() {
  return apiPost(API_ENDPOINTS.AUTH.LOGOUT, {});
}

export async function fetchCurrentUser() {
  const data = await apiGet(API_ENDPOINTS.AUTH.ME);
  return userSchema.parse(data);
}
