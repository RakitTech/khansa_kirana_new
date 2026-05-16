import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapProduct } from "@/lib/db-mappers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conditions: string[] = [];
  const params: unknown[] = [];

  const isAvailable = searchParams.get("isAvailable") ?? searchParams.get("is_available");
  if (isAvailable !== null) {
    conditions.push("is_available = ?");
    params.push(isAvailable === "true" || isAvailable === "1" ? 1 : 0);
  }
  const showInGallery = searchParams.get("showInGallery") ?? searchParams.get("show_in_gallery");
  if (showInGallery !== null) {
    conditions.push("show_in_gallery = ?");
    params.push(showInGallery === "true" || showInGallery === "1" ? 1 : 0);
  }
  const category = searchParams.get("category");
  if (category) { conditions.push("category = ?"); params.push(category); }
  const province = searchParams.get("province");
  if (province) { conditions.push("province = ?"); params.push(province); }
  const search = searchParams.get("search") ?? searchParams.get("q");
  if (search) {
    conditions.push("(name LIKE ? OR province LIKE ? OR category LIKE ?)");
    const q = `%${search}%`;
    params.push(q, q, q);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await db.query(`SELECT * FROM products ${where} ORDER BY created_at DESC`, params);
  return NextResponse.json((rows as Record<string, unknown>[]).map(mapProduct));
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json();
  const id = randomUUID();
  await db.query(
    `INSERT INTO products (id, name, description, image_url, price, category, province, traditional_name, is_available, show_in_gallery, stock_qty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, body.name, body.description ?? "", body.imageUrl ?? "",
      Number(body.price ?? 0), body.category ?? "",
      body.province ?? "", body.traditionalName ?? "",
      body.isAvailable !== false ? 1 : 0,
      body.showInGallery ? 1 : 0,
      Number(body.stockQty ?? 0),
    ]
  );
  const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapProduct((rows as Record<string, unknown>[])[0]), { status: 201 });
}
