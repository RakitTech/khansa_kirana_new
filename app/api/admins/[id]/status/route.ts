import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapAdminUser } from "@/lib/db-mappers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth || auth.role !== "super_admin") return unauthorized();
  const { id } = await params;
  await db.query(
    "UPDATE admin_users SET is_active = NOT is_active WHERE id = ?",
    [id]
  );
  const [rows] = await db.query("SELECT * FROM admin_users WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapAdminUser((rows as Record<string, unknown>[])[0]));
}
