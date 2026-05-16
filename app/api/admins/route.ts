import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapAdminUser } from "@/lib/db-mappers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const [rows] = await db.query("SELECT * FROM admin_users ORDER BY created_at ASC");
  return NextResponse.json((rows as Record<string, unknown>[]).map(mapAdminUser));
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth || auth.role !== "super_admin") return unauthorized();

  const body = await req.json();
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email dan password wajib" }, { status: 400 });
  }

  const hash = await bcrypt.hash(body.password, 12);
  const id = randomUUID();
  await db.query(
    `INSERT INTO admin_users (id, email, name, role, is_active, password_hash)
     VALUES (?, ?, ?, ?, 1, ?)`,
    [id, body.email, body.name ?? "", body.role ?? "admin", hash]
  );
  const [rows] = await db.query("SELECT * FROM admin_users WHERE id = ? LIMIT 1", [id]);
  return NextResponse.json(mapAdminUser((rows as Record<string, unknown>[])[0]), { status: 201 });
}
