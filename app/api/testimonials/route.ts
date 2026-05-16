import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapTestimonial } from "@/lib/db-mappers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("is_active") === "true";
  const where = activeOnly ? "WHERE is_active = 1" : "";
  const [rows] = await db.query(`SELECT * FROM testimonials ${where} ORDER BY sort_order ASC, created_at ASC`);
  return NextResponse.json((rows as Record<string, unknown>[]).map(mapTestimonial));
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json();
  const id = randomUUID();
  await db.query(
    `INSERT INTO testimonials (id, name, occasion, review, rating, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, body.name, body.occasion ?? "", body.review ?? "",
     Number(body.rating ?? 5), body.isActive !== false ? 1 : 0,
     Number(body.sortOrder ?? 0)]
  );
  const [rows] = await db.query("SELECT * FROM testimonials WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapTestimonial((rows as Record<string, unknown>[])[0]), { status: 201 });
}
