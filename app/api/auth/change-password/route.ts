import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorized();

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Password wajib diisi" }, { status: 400 });
  }

  const [rows] = await db.query(
    "SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1",
    [payload.id]
  );
  const users = rows as Record<string, unknown>[];
  if (!users.length) return unauthorized();

  const valid = await bcrypt.compare(currentPassword, String(users[0].password_hash));
  if (!valid) {
    return NextResponse.json({ error: "Password lama salah" }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await db.query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [hash, payload.id]);

  return NextResponse.json({ message: "Password berhasil diubah" });
}
