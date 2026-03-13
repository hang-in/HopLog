import { beforeEach, describe, expect, it, vi } from "vitest";

describe("api/posts route", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("clamps negative offsets and oversized limits", async () => {
    const getPostListPage = vi.fn(() => ({ items: [], totalCount: 0 }));

    vi.doMock("@/lib/posts", () => ({
      getPostListPage,
    }));
    vi.doMock("@/lib/logger", () => ({
      createLogger: () => ({
        info: vi.fn(),
      }),
    }));

    const { GET } = await import("@/app/api/posts/route");
    const { NextRequest } = await import("next/server");
    const response = await GET(new NextRequest("http://localhost/api/posts?offset=-10&limit=999"));

    expect(getPostListPage).toHaveBeenCalledWith({
      category: undefined,
      offset: 0,
      limit: 100,
    });
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=60, s-maxage=60");
  });

  it("uses defaults for invalid pagination inputs and trims categories", async () => {
    const getPostListPage = vi.fn(() => ({ items: [], totalCount: 0 }));

    vi.doMock("@/lib/posts", () => ({
      getPostListPage,
    }));
    vi.doMock("@/lib/logger", () => ({
      createLogger: () => ({
        info: vi.fn(),
      }),
    }));

    const { GET } = await import("@/app/api/posts/route");
    const { NextRequest } = await import("next/server");

    await GET(new NextRequest("http://localhost/api/posts?offset=abc&limit=xyz&category=%20Config%20"));

    expect(getPostListPage).toHaveBeenCalledWith({
      category: "Config",
      offset: 0,
      limit: 10,
    });
  });
});
