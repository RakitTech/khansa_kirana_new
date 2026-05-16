import db from "@/lib/db";
import { mapProduct } from "@/lib/db-mappers";
import type { Product } from "@/lib/types";

interface Filters {
  category?: string;
  province?: string;
  isAvailable?: boolean;
  showInGallery?: boolean;
  search?: string;
}

export async function dbGetProducts(filters: Filters = {}): Promise<Product[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.isAvailable !== undefined) {
    conditions.push("is_available = ?");
    params.push(filters.isAvailable ? 1 : 0);
  }
  if (filters.showInGallery !== undefined) {
    conditions.push("show_in_gallery = ?");
    params.push(filters.showInGallery ? 1 : 0);
  }
  if (filters.category) {
    conditions.push("category = ?");
    params.push(filters.category);
  }
  if (filters.province) {
    conditions.push("province = ?");
    params.push(filters.province);
  }
  if (filters.search) {
    conditions.push("(name LIKE ? OR province LIKE ? OR category LIKE ?)");
    const q = `%${filters.search}%`;
    params.push(q, q, q);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await db.query(`SELECT * FROM products ${where} ORDER BY created_at DESC`, params);
  return (rows as Record<string, unknown>[]).map(mapProduct);
}
