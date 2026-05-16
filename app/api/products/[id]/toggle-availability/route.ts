import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapProduct } from "@/lib/db-mappers";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  await db.query(
    "UPDATE products SET is_available = NOT is_available, updated_at = NOW() WHERE id = ?",
    [id]
  );
  const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  const list = rows as Record<string, unknown>[];
  if (!list.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapProduct(list[0]));
}
