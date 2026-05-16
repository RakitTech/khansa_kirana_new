import apiClient from "./client";
import type { Order, OrderStatus, RentalStatus, PaymentStatus } from "../types";

interface OrderFilters {
  status?: OrderStatus;
  rentalStatus?: RentalStatus;
  paymentStatus?: PaymentStatus;
}

export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>("/orders", { params: filters });
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${id}`);
  return data;
}

export async function createOrder(payload: Partial<Order>): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", payload);
  return data;
}

export async function updateOrderStatus(
  id: string,
  payload: {
    status?: OrderStatus;
    rentalStatus?: RentalStatus;
    actualReturnDate?: string;
  }
): Promise<Order> {
  const { data } = await apiClient.put<Order>(`/orders/${id}/status`, payload);
  return data;
}

export async function updateOrderPayment(
  id: string,
  payload: { paymentStatus: PaymentStatus; paidAmount: number }
): Promise<Order> {
  const { data } = await apiClient.put<Order>(`/orders/${id}/payment`, payload);
  return data;
}
