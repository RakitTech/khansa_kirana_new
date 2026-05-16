import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth || auth.role !== "super_admin") return unauthorized();
  const { id } = await params;
  if (id === auth.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }
  await db.query("DELETE FROM admin_users WHERE id = ?", [id]);
  return NextResponse.json({ message: "Deleted" });
}
