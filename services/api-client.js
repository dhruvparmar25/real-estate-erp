import axios from "axios";
import { ENV } from "@/config/env";
import { ROUTES } from "@/constants/routes";
import { API_ENDPOINTS } from "@/constants/api-endpoints.constants";

const PUBLIC_AUTH_ENDPOINTS = [API_ENDPOINTS.AUTH.LOGIN];

// CORS allowlist lives on the backend (CORS_ALLOWED_ORIGINS), not here.
export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: 20_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const requestPath = (error.config?.url ?? "").split("?")[0];
      const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some(
        (endpoint) =>
          requestPath.endsWith(endpoint.replace(/\/$/, "")) ||
          requestPath.endsWith(endpoint)
      );

      if (error.response?.status === 401 && !isPublicAuthRequest) {
        window.location.assign(ROUTES.login);
      } else if (error.response?.status === 403 && !isPublicAuthRequest) {
        window.location.assign(ROUTES.forbidden);
      }
    }
    return Promise.reject(error);
  }
);

export async function apiGet(url, config) {
  const response = await apiClient.get(url, config);
  return response.data;
}

export async function apiPost(url, data, config) {
  const response = await apiClient.post(url, data, config);
  return response.data;
}

export async function apiPatch(url, data, config) {
  const response = await apiClient.patch(url, data, config);
  return response.data;
}

export async function apiPut(url, data, config) {
  const response = await apiClient.put(url, data, config);
  return response.data;
}

export async function apiDelete(url, config) {
  const response = await apiClient.delete(url, config);
  return response.data;
}
