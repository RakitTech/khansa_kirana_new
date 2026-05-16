import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapTestimonial } from "@/lib/db-mappers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  await db.query(
    `UPDATE testimonials SET name=?, occasion=?, review=?, rating=?, is_active=?, sort_order=?, updated_at=NOW() WHERE id=?`,
    [body.name, body.occasion ?? "", body.review ?? "", Number(body.rating ?? 5),
     body.isActive ? 1 : 0, Number(body.sortOrder ?? 0), id]
  );
  const [rows] = await db.query("SELECT * FROM testimonials WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapTestimonial((rows as Record<string, unknown>[])[0]));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  await db.query("DELETE FROM testimonials WHERE id = ?", [id]);
  return NextResponse.json({ message: "Deleted" });
}
