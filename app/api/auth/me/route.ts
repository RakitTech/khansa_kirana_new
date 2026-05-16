import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapAdminUser } from "@/lib/db-mappers";

export async function GET(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorized();

  const [rows] = await db.query(
    "SELECT * FROM admin_users WHERE id = ? AND is_active = 1 LIMIT 1",
    [payload.id]
  );
  const users = rows as Record<string, unknown>[];
  if (!users.length) return unauthorized();

  return NextResponse.json(mapAdminUser(users[0]));
}
