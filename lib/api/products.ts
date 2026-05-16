import apiClient from "./client";
import type { Product } from "../types";

interface ProductFilters {
  category?: string;
  province?: string;
  isAvailable?: boolean;
  showInGallery?: boolean;
  search?: string;
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>("/products", { params: filters });
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const { data } = await apiClient.post<Product>("/products", payload);
  return data;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

export async function toggleAvailability(id: string): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}/toggle-availability`);
  return data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>("/products/search", { params: { q: query } });
  return data;
}
