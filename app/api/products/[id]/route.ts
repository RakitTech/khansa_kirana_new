import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapProduct } from "@/lib/db-mappers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  const list = rows as Record<string, unknown>[];
  if (!list.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapProduct(list[0]));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  await db.query(
    `UPDATE products SET name=?, description=?, image_url=?, price=?, category=?, province=?,
     traditional_name=?, is_available=?, show_in_gallery=?, stock_qty=?, updated_at=NOW()
     WHERE id=?`,
    [
      body.name, body.description ?? "", body.imageUrl ?? "",
      Number(body.price ?? 0), body.category ?? "", body.province ?? "",
      body.traditionalName ?? "", body.isAvailable ? 1 : 0,
      body.showInGallery ? 1 : 0, Number(body.stockQty ?? 0), id,
    ]
  );
  const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  const list = rows as Record<string, unknown>[];
  if (!list.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapProduct(list[0]));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  await db.query("DELETE FROM products WHERE id = ?", [id]);
  return NextResponse.json({ message: "Deleted" });
}
