import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import { requireAuth, unauthorized } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "File diperlukan" }, { status: 400 });
  }

  const ext = extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads", folder);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, filename), buffer);

  const url = `/uploads/${folder}/${filename}`;
  return NextResponse.json({ url });
}
