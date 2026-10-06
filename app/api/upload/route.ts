import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { requireAuth, unauthorized } from "@/lib/auth-server";

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "File diperlukan" }, { status: 400 });
  }

  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  let buffer: Buffer<ArrayBufferLike> = Buffer.from(await file.arrayBuffer());
  let filename: string;

  if (IMAGE_TYPES.includes(file.type)) {
    buffer = await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    filename = `${randomUUID()}.webp`;
  } else {
    const ext = extname(file.name) || ".jpg";
    filename = `${randomUUID()}${ext}`;
  }

  await writeFile(join(uploadDir, filename), buffer);
  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
