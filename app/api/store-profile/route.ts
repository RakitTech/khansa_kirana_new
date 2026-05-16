import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-server";
import { mapStoreProfile } from "@/lib/db-mappers";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM store_profile LIMIT 1");
  const list = rows as Record<string, unknown>[];
  if (!list.length) return NextResponse.json(null);
  return NextResponse.json(mapStoreProfile(list[0]));
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json();
  const heroImages = Array.isArray(body.heroImages) ? JSON.stringify(body.heroImages) : "[]";

  const [existing] = await db.query("SELECT id FROM store_profile LIMIT 1");
  const list = existing as Record<string, unknown>[];

  if (list.length) {
    const id = list[0].id;
    await db.query(
      `UPDATE store_profile SET store_name=?, logo_url=?, address=?, gmaps_link=?,
       latitude=?, longitude=?, phone=?, whatsapp=?, instagram_url=?, facebook_url=?,
       tiktok_url=?, operational_hours=?, hero_images=?, updated_at=NOW()
       WHERE id=?`,
      [body.storeName ?? "", body.logoUrl ?? "", body.address ?? "", body.gmapsLink ?? "",
       body.latitude ?? null, body.longitude ?? null, body.phone ?? "", body.whatsapp ?? "",
       body.instagramUrl ?? "", body.facebookUrl ?? "", body.tiktokUrl ?? "",
       body.operationalHours ?? "", heroImages, id]
    );
  } else {
    const id = randomUUID();
    await db.query(
      `INSERT INTO store_profile (id, store_name, logo_url, address, gmaps_link, latitude, longitude,
       phone, whatsapp, instagram_url, facebook_url, tiktok_url, operational_hours, hero_images)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, body.storeName ?? "", body.logoUrl ?? "", body.address ?? "", body.gmapsLink ?? "",
       body.latitude ?? null, body.longitude ?? null, body.phone ?? "", body.whatsapp ?? "",
       body.instagramUrl ?? "", body.facebookUrl ?? "", body.tiktokUrl ?? "",
       body.operationalHours ?? "", heroImages]
    );
  }

  const [rows] = await db.query("SELECT * FROM store_profile LIMIT 1");
  return NextResponse.json(mapStoreProfile((rows as Record<string, unknown>[])[0]));
}
