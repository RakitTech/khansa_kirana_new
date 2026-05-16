import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapCatalogProvince } from "@/lib/db-mappers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  await db.query(
    `UPDATE catalog_provinces SET name=?, island_key=?, costume_name=?, description=?,
     image_url=?, price_from=?, is_active=?, sort_order=?, updated_at=NOW() WHERE id=?`,
    [body.name, body.islandKey ?? "", body.costumeName ?? "", body.description ?? "",
     body.imageUrl ?? "", body.priceFrom ? `Rp ${Number(body.priceFrom).toLocaleString("id-ID")}` : "Rp 0",
     body.isActive ? 1 : 0, Number(body.sortOrder ?? 0), id]
  );
  const [rows] = await db.query("SELECT * FROM catalog_provinces WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapCatalogProvince((rows as Record<string, unknown>[])[0]));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  await db.query("DELETE FROM catalog_provinces WHERE id = ?", [id]);
  return NextResponse.json({ message: "Deleted" });
}
