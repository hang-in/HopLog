import { NextRequest, NextResponse } from "next/server";
import { POSTS_PER_PAGE } from "@/lib/data";
import { getPostListPage } from "@/lib/posts";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/posts");

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category")?.trim() || undefined;
  const offsetParam = Number.parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10);
  const limitParam = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? `${POSTS_PER_PAGE}`, 10);

  const offset = Number.isNaN(offsetParam) ? 0 : offsetParam;
  const limit = Number.isNaN(limitParam) ? POSTS_PER_PAGE : limitParam;

  const start = performance.now();
  const data = getPostListPage({ category, offset, limit });
  const ms = (performance.now() - start).toFixed(1);

  log.info(`cat=${category ?? "all"} offset=${offset} limit=${limit} → ${data.items.length}/${data.totalCount} posts (${ms}ms)`);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
