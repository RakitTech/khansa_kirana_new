import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapOrder, mapOrderItem } from "@/lib/db-mappers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  const { id } = await params;
  const body = await req.json();

  const sets: string[] = ["updated_at = NOW()"];
  const vals: unknown[] = [];

  if (body.status) { sets.push("status = ?"); vals.push(body.status); }
  if (body.rentalStatus) { sets.push("rental_status = ?"); vals.push(body.rentalStatus); }
  if (body.actualReturnDate !== undefined) {
    sets.push("actual_return_date = ?");
    vals.push(body.actualReturnDate ? new Date(body.actualReturnDate) : null);
  }
  vals.push(id);

  await db.query(`UPDATE orders SET ${sets.join(", ")} WHERE id = ?`, vals);
  const [orderRows] = await db.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  const orders = orderRows as Record<string, unknown>[];
  if (!orders.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [itemRows] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
  return NextResponse.json(mapOrder(orders[0], (itemRows as Record<string, unknown>[]).map(mapOrderItem)));
}
