import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapOrder, mapOrderItem } from "@/lib/db-mappers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  const body = await req.json();

  await db.query(
    "UPDATE orders SET payment_status = ?, paid_amount = ?, updated_at = NOW() WHERE id = ?",
    [body.paymentStatus, Number(body.paidAmount ?? 0), id]
  );
  const [orderRows] = await db.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  const orders = orderRows as Record<string, unknown>[];
  if (!orders.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [itemRows] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
  return NextResponse.json(mapOrder(orders[0], (itemRows as Record<string, unknown>[]).map(mapOrderItem)));
}
