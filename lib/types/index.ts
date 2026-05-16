// ── Product ──────────────────────────────────────────────
export interface ProductVariant {
  id: string;
  productId: string;
  sizeLabel: string;
  colorLabel: string;
  stockQty: number;
  priceOverride?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  price: number;
  category: string;
  province: string;
  traditionalName: string;
  isAvailable: boolean;
  stockQty: number;
  showInGallery: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// ── Order ─────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  productName: string;
  category: string;
  sizeLabel: string;
  colorLabel: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export type OrderStatus = "pending" | "confirmed" | "cancelled";
export type RentalStatus = "booked" | "handed_over" | "returned" | "overdue";
export type PaymentStatus = "unpaid" | "partial" | "paid";

export interface Order {
  id: string;
  orderCode: string;
  source: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  customerInstitution: string;
  handoverDate: string;
  plannedReturnDate: string;
  actualReturnDate?: string;
  status: OrderStatus;
  rentalStatus: RentalStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ── Testimonial ───────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  occasion: string;
  review: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Store Profile ─────────────────────────────────────────
export interface StoreProfile {
  id: string;
  storeName: string;
  logoUrl: string;
  address: string;
  gmapsLink: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  operationalHours: string;
  heroImages: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Catalog Province ──────────────────────────────────────
export interface CatalogProvince {
  id: string;
  name: string;
  islandKey: string;
  costumeName: string;
  description: string;
  imageUrl: string;
  priceFrom: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IslandGroup {
  id: string;
  key: string;
  name: string;
  sortOrder: number;
}

// ── Admin User ────────────────────────────────────────────
export type AdminRole = "super_admin" | "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

// ── Auth ──────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: AdminUser;
}

// ── API Response ──────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
