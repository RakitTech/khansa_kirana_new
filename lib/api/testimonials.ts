import apiClient from "./client";
import type { Testimonial } from "../types";

export async function getTestimonials(activeOnly = true): Promise<Testimonial[]> {
  const { data } = await apiClient.get<Testimonial[]>("/testimonials", {
    params: activeOnly ? { is_active: true } : undefined,
  });
  return data;
}

export async function createTestimonial(payload: Partial<Testimonial>): Promise<Testimonial> {
  const { data } = await apiClient.post<Testimonial>("/testimonials", payload);
  return data;
}

export async function updateTestimonial(id: string, payload: Partial<Testimonial>): Promise<Testimonial> {
  const { data } = await apiClient.put<Testimonial>(`/testimonials/${id}`, payload);
  return data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiClient.delete(`/testimonials/${id}`);
}

export async function toggleTestimonialActive(id: string): Promise<Testimonial> {
  const { data } = await apiClient.put<Testimonial>(`/testimonials/${id}/toggle-active`);
  return data;
}
