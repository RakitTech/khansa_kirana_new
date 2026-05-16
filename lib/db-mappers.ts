import type {
  Product, Testimonial, StoreProfile, CatalogProvince,
  IslandGroup, AdminUser, Order, OrderItem,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function isoDate(v: unknown): string {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

export function mapProduct(row: Row): Product {
  return {
    id: row.id,
    name: row.name ?? "",
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    imageUrls: [],
    price: Number(row.price ?? 0),
    category: row.category ?? "",
    province: row.province ?? "",
    traditionalName: row.traditional_name ?? "",
    isAvailable: Boolean(row.is_available),
    stockQty: Number(row.stock_qty ?? 0),
    showInGallery: Boolean(row.show_in_gallery),
    variants: [],
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
  };
}

export function mapTestimonial(row: Row): Testimonial {
  return {
    id: row.id,
    name: row.name ?? "",
    occasion: row.occasion ?? "",
    review: row.review ?? "",
    rating: Number(row.rating ?? 5),
    isActive: Boolean(row.is_active),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
  };
}

export function mapStoreProfile(row: Row): StoreProfile {
  let heroImages: string[] = [];
  try {
    heroImages = row.hero_images ? JSON.parse(row.hero_images) : [];
  } catch { /* ignore */ }
  return {
    id: row.id,
    storeName: row.store_name ?? "",
    logoUrl: row.logo_url ?? "",
    address: row.address ?? "",
    gmapsLink: row.gmaps_link ?? "",
    latitude: Number(row.latitude ?? 0),
    longitude: Number(row.longitude ?? 0),
    phone: row.phone ?? "",
    whatsapp: row.whatsapp ?? "",
    instagramUrl: row.instagram_url ?? "",
    facebookUrl: row.facebook_url ?? "",
    tiktokUrl: row.tiktok_url ?? "",
    operationalHours: row.operational_hours ?? "",
    heroImages,
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
  };
}

export function mapCatalogProvince(row: Row): CatalogProvince {
  return {
    id: row.id,
    name: row.name ?? "",
    islandKey: row.island_key ?? "",
    costumeName: row.costume_name ?? "",
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    priceFrom: row.price_from ? Number(String(row.price_from).replace(/[^0-9]/g, "")) : 0,
    isActive: Boolean(row.is_active),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
  };
}

export function mapIslandGroup(row: Row): IslandGroup {
  return {
    id: row.id,
    key: row.key ?? "",
    name: row.name ?? "",
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export function mapAdminUser(row: Row): AdminUser {
  return {
    id: row.id,
    email: row.email ?? "",
    name: row.name ?? "",
    role: row.role ?? "admin",
    isActive: Boolean(row.is_active),
    lastLoginAt: row.last_login_at ? isoDate(row.last_login_at) : undefined,
    createdAt: isoDate(row.created_at),
  };
}

export function mapOrderItem(row: Row): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id ?? "",
    productId: row.product_id ?? "",
    variantId: row.variant_id ?? undefined,
    productName: row.product_name ?? "",
    category: row.category ?? "",
    sizeLabel: row.size_label ?? "",
    colorLabel: row.color_label ?? "",
    unitPrice: Number(row.unit_price ?? 0),
    quantity: Number(row.quantity ?? 1),
    subtotal: Number(row.subtotal ?? 0),
    notes: row.notes ?? undefined,
  };
}

export function mapOrder(row: Row, items: OrderItem[] = []): Order {
  return {
    id: row.id,
    orderCode: row.order_code ?? "",
    source: row.source ?? "walk_in",
    customerName: row.customer_name ?? "",
    customerPhone: row.customer_phone ?? "",
    customerWhatsapp: row.customer_whatsapp ?? "",
    customerInstitution: row.customer_institution ?? "",
    handoverDate: isoDate(row.handover_date),
    plannedReturnDate: isoDate(row.planned_return_date),
    actualReturnDate: row.actual_return_date ? isoDate(row.actual_return_date) : undefined,
    status: row.status ?? "pending",
    rentalStatus: row.rental_status ?? "booked",
    paymentStatus: row.payment_status ?? "unpaid",
    totalAmount: Number(row.total_amount ?? 0),
    paidAmount: Number(row.paid_amount ?? 0),
    items,
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
  };
}
