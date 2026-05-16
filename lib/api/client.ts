import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Client-side only: relative /api path (browser resolves it to same origin)
export const BASE_URL = "/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      document.cookie = "access_token=; path=/; max-age=0";
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
