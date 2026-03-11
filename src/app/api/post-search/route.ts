import { NextRequest, NextResponse } from "next/server";
import { createSearchProvider } from "@/lib/search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const provider = createSearchProvider();
  const data = query ? await provider.search(query) : await provider.getInitialItems();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": provider.getQueryCacheControl(query),
    },
  });
}
