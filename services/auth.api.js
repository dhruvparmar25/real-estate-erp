import { z } from "zod";
import { apiGet, apiPost } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints.constants";
import { parseApiData } from "@/schemas/api.schema";
import { keysToSnake } from "@/utils/case";

export const userSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.string().email().optional(),
  username: z.string().optional(),
  fullName: z.string().optional(),
  role: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  permissions: z.array(z.string()).optional(),
});

export async function loginRequest(credentials) {
  const data = await apiPost(API_ENDPOINTS.AUTH.LOGIN, keysToSnake(credentials));
  return parseApiData(loginResponseSchema, data);
}

export async function logoutRequest() {
  return apiPost(API_ENDPOINTS.AUTH.LOGOUT, {});
}

export async function fetchCurrentUser() {
  const data = await apiGet(API_ENDPOINTS.AUTH.ME);
  return parseApiData(userSchema, data);
}
