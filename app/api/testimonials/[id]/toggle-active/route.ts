import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapTestimonial } from "@/lib/db-mappers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  await db.query(
    "UPDATE testimonials SET is_active = NOT is_active, updated_at = NOW() WHERE id = ?",
    [id]
  );
  const [rows] = await db.query("SELECT * FROM testimonials WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapTestimonial((rows as Record<string, unknown>[])[0]));
}
