import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: imagePathArray } = await params;
  const imagePath = imagePathArray.join("/");

  const contentDir = process.env.CONTENT_DIR || "content";
  const fullPath = path.join(process.cwd(), contentDir, "images", imagePath);

  if (!fs.existsSync(fullPath)) {
    return new NextResponse("Image Not Found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(fullPath);

  const ext = path.extname(fullPath).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".gif") contentType = "image/gif";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".svg") contentType = "image/svg+xml";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
