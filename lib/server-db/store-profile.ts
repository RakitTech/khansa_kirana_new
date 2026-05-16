import db from "@/lib/db";
import { mapStoreProfile } from "@/lib/db-mappers";
import type { StoreProfile } from "@/lib/types";

export async function dbGetStoreProfile(): Promise<StoreProfile | null> {
  const [rows] = await db.query("SELECT * FROM store_profile LIMIT 1");
  const list = rows as Record<string, unknown>[];
  if (!list.length) return null;
  return mapStoreProfile(list[0]);
}
