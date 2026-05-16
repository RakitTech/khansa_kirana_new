import db from "@/lib/db";
import { mapTestimonial } from "@/lib/db-mappers";
import type { Testimonial } from "@/lib/types";

export async function dbGetTestimonials(activeOnly = true): Promise<Testimonial[]> {
  const where = activeOnly ? "WHERE is_active = 1" : "";
  const [rows] = await db.query(`SELECT * FROM testimonials ${where} ORDER BY sort_order ASC, created_at ASC`);
  return (rows as Record<string, unknown>[]).map(mapTestimonial);
}
