import { NextResponse } from "next/server";
import db from "@/lib/db";
import { mapIslandGroup } from "@/lib/db-mappers";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM island_groups ORDER BY sort_order ASC");
  return NextResponse.json((rows as Record<string, unknown>[]).map(mapIslandGroup));
}
