import db from "@/lib/db";
import { mapCatalogProvince, mapIslandGroup } from "@/lib/db-mappers";
import type { CatalogProvince, IslandGroup } from "@/lib/types";

export async function dbGetCatalogProvinces(activeOnly = true): Promise<CatalogProvince[]> {
  const where = activeOnly ? "WHERE is_active = 1" : "";
  const [rows] = await db.query(`SELECT * FROM catalog_provinces ${where} ORDER BY sort_order ASC, name ASC`);
  return (rows as Record<string, unknown>[]).map(mapCatalogProvince);
}

export async function dbGetIslandGroups(): Promise<IslandGroup[]> {
  const [rows] = await db.query("SELECT * FROM island_groups ORDER BY sort_order ASC");
  return (rows as Record<string, unknown>[]).map(mapIslandGroup);
}
