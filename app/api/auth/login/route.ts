import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signToken } from "@/lib/auth-server";
import { mapAdminUser } from "@/lib/db-mappers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const [rows] = await db.query(
      "SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1",
      [email]
    );
    const users = rows as Record<string, unknown>[];
    if (!users.length) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, String(user.password_hash));
    if (!valid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    await db.query("UPDATE admin_users SET last_login_at = NOW() WHERE id = ?", [user.id]);

    const token = signToken({ id: String(user.id), email: String(user.email), role: String(user.role) });

    return NextResponse.json({
      accessToken: token,
      admin: mapAdminUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
