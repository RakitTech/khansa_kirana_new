import apiClient from "./client";
import type { CatalogProvince, IslandGroup } from "../types";

export async function getCatalogProvinces(activeOnly = true): Promise<CatalogProvince[]> {
  const { data } = await apiClient.get<CatalogProvince[]>("/catalog/provinces", {
    params: activeOnly ? { is_active: true } : undefined,
  });
  return data;
}

export async function createCatalogProvince(payload: Partial<CatalogProvince>): Promise<CatalogProvince> {
  const { data } = await apiClient.post<CatalogProvince>("/catalog/provinces", payload);
  return data;
}

export async function updateCatalogProvince(id: string, payload: Partial<CatalogProvince>): Promise<CatalogProvince> {
  const { data } = await apiClient.put<CatalogProvince>(`/catalog/provinces/${id}`, payload);
  return data;
}

export async function deleteCatalogProvince(id: string): Promise<void> {
  await apiClient.delete(`/catalog/provinces/${id}`);
}

export async function toggleCatalogProvinceActive(id: string): Promise<CatalogProvince> {
  const { data } = await apiClient.put<CatalogProvince>(`/catalog/provinces/${id}/toggle-active`);
  return data;
}

export async function getIslandGroups(): Promise<IslandGroup[]> {
  const { data } = await apiClient.get<IslandGroup[]>("/catalog/islands");
  return data;
}
