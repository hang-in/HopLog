import { NextResponse } from "next/server";
import { getPostSearchItems } from "@/lib/posts";

export async function GET() {
  return NextResponse.json(getPostSearchItems(), {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
