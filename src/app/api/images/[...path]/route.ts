import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: imagePathArray } = await params;
  const imagePath = imagePathArray.join("/");

  // 환경 변수로 지정된 이미지 폴더 경로 계산
  const contentDir = process.env.CONTENT_DIR || "content";
  const fullPath = path.join(process.cwd(), contentDir, "images", imagePath);

  // 파일이 없으면 404
  if (!fs.existsSync(fullPath)) {
    return new NextResponse("Image Not Found", { status: 404 });
  }

  // 파일 읽기
  const fileBuffer = fs.readFileSync(fullPath);

  // 확장자에 따른 단순 Content-Type 추론
  const ext = path.extname(fullPath).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".gif") contentType = "image/gif";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".svg") contentType = "image/svg+xml";

  // 캐싱 헤더를 포함하여 안전하게 반환
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
