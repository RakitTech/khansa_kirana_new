import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapCatalogProvince } from "@/lib/db-mappers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("is_active") === "true";
  const where = activeOnly ? "WHERE is_active = 1" : "";
  const [rows] = await db.query(`SELECT * FROM catalog_provinces ${where} ORDER BY sort_order ASC, name ASC`);
  return NextResponse.json((rows as Record<string, unknown>[]).map(mapCatalogProvince));
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json();
  const id = randomUUID();
  await db.query(
    `INSERT INTO catalog_provinces (id, name, island_key, costume_name, description, image_url, price_from, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, body.name, body.islandKey ?? "", body.costumeName ?? "", body.description ?? "",
     body.imageUrl ?? "", body.priceFrom ? `Rp ${Number(body.priceFrom).toLocaleString("id-ID")}` : "Rp 0",
     body.isActive !== false ? 1 : 0, Number(body.sortOrder ?? 0)]
  );
  const [rows] = await db.query("SELECT * FROM catalog_provinces WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapCatalogProvince((rows as Record<string, unknown>[])[0]), { status: 201 });
}
