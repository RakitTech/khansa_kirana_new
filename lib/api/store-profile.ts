import apiClient from "./client";
import type { StoreProfile } from "../types";

export async function getStoreProfile(): Promise<StoreProfile> {
  const { data } = await apiClient.get<StoreProfile>("/store-profile");
  return data;
}

export async function updateStoreProfile(_id: string, payload: Partial<StoreProfile>): Promise<StoreProfile> {
  const { data } = await apiClient.put<StoreProfile>("/store-profile", payload);
  return data;
}
