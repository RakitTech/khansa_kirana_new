import apiClient from "./client";
import type { AdminUser, AdminRole } from "../types";

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await apiClient.get<AdminUser[]>("/admins");
  return data;
}

export async function createAdminUser(payload: {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
}): Promise<AdminUser> {
  const { data } = await apiClient.post<AdminUser>("/admins", payload);
  return data;
}

export async function toggleAdminStatus(id: string): Promise<AdminUser> {
  const { data } = await apiClient.put<AdminUser>(`/admins/${id}/status`);
  return data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await apiClient.delete(`/admins/${id}`);
}
