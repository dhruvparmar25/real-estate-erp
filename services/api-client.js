import axios from "axios";
import { ENV } from "@/config/env";
import { ROUTES } from "@/constants/routes.constants";
import { API_ENDPOINTS } from "@/constants/api-endpoints.constants";
import { keysToCamel, keysToSnake } from "@/utils/case";

const CSRF_COOKIE = "csrftoken";
const CSRF_HEADER = "X-CSRFToken";
const UNSAFE = new Set(["post", "put", "patch", "delete"]);
const PUBLIC_AUTH = new Set([API_ENDPOINTS.AUTH.LOGIN]);

function readCookie(name) {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: 20_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
    config.data = keysToSnake(config.data);
  }
  if (config.params && typeof config.params === "object") {
    config.params = keysToSnake(config.params);
  }
  if (config.method && UNSAFE.has(config.method.toLowerCase())) {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) config.headers[CSRF_HEADER] = csrf;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === "object") {
      res.data = keysToCamel(res.data);
    }
    return res;
  },
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const path = (error.config?.url ?? "").split("?")[0].replace(/\/$/, "");
    const isPublicAuth = [...PUBLIC_AUTH].some((p) => path.endsWith(p.replace(/\/$/, "")));
    const status = error.response?.status;

    if (status === 401 && !isPublicAuth) window.location.assign(ROUTES.login);
    else if (status === 403 && !isPublicAuth) window.location.assign(ROUTES.forbidden);

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
