import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapOrder, mapOrderItem } from "@/lib/db-mappers";

async function getOrderWithItems(id: string) {
  const [orderRows] = await db.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  const orders = orderRows as Record<string, unknown>[];
  if (!orders.length) return null;
  const [itemRows] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
  const items = (itemRows as Record<string, unknown>[]).map(mapOrderItem);
  return mapOrder(orders[0], items);
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const { searchParams } = new URL(req.url);
  const conditions: string[] = [];
  const params: unknown[] = [];

  const status = searchParams.get("status");
  if (status) { conditions.push("status = ?"); params.push(status); }
  const rentalStatus = searchParams.get("rentalStatus");
  if (rentalStatus) { conditions.push("rental_status = ?"); params.push(rentalStatus); }
  const paymentStatus = searchParams.get("paymentStatus");
  if (paymentStatus) { conditions.push("payment_status = ?"); params.push(paymentStatus); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [orderRows] = await db.query(`SELECT * FROM orders ${where} ORDER BY created_at DESC`, params);
  const orders = orderRows as Record<string, unknown>[];

  const result = await Promise.all(
    orders.map(async (row) => {
      const [itemRows] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [row.id]);
      return mapOrder(row, (itemRows as Record<string, unknown>[]).map(mapOrderItem));
    })
  );
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json();
  const orderId = randomUUID();
  const orderCode = `ORD-${Date.now()}`;

  await db.query(
    `INSERT INTO orders (id, order_code, source, customer_name, customer_phone, customer_whatsapp,
     customer_institution, handover_date, planned_return_date, status, rental_status, payment_status,
     total_amount, paid_amount)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [orderId, orderCode, body.source ?? "walk_in",
     body.customerName, body.customerPhone ?? "", body.customerWhatsapp ?? "",
     body.customerInstitution ?? null,
     body.handoverDate, body.plannedReturnDate,
     body.status ?? "pending", body.rentalStatus ?? "booked",
     body.paymentStatus ?? "unpaid",
     Number(body.totalAmount ?? 0), Number(body.paidAmount ?? 0)]
  );

  if (Array.isArray(body.items)) {
    for (const item of body.items) {
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, product_name, category, size_label, color_label, unit_price, quantity, subtotal)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [randomUUID(), orderId, item.productId ?? null, item.productName ?? "",
         item.category ?? "", item.sizeLabel ?? "", item.colorLabel ?? "",
         Number(item.unitPrice ?? 0), Number(item.quantity ?? 1),
         Number(item.unitPrice ?? 0) * Number(item.quantity ?? 1)]
      );
    }
  }

  const order = await getOrderWithItems(orderId);
  return NextResponse.json(order, { status: 201 });
}
