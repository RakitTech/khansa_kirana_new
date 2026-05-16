import apiClient from "./client";
import type { AuthResponse, AdminUser, LoginPayload } from "../types";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.accessToken);
    // Also store in cookie so middleware can read it
    document.cookie = `access_token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
  return data;
}

export async function getMe(): Promise<AdminUser> {
  const { data } = await apiClient.get<AdminUser>("/auth/me");
  return data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiClient.post("/auth/change-password", { currentPassword, newPassword });
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    document.cookie = "access_token=; path=/; max-age=0";
    window.location.href = "/admin/login";
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("access_token"));
}
