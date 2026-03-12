import { describe, expect, it } from "vitest";

import { isPrivatePost, parseSEO } from "@/lib/posts";

describe("isPrivatePost", () => {
  it("returns true when visibility is private", () => {
    expect(isPrivatePost({ visibility: "public" })).toBe(true);
  });

  it("returns false when visibility is public", () => {
    expect(isPrivatePost({ visibility: "public" })).toBe(false);
  });

  it("returns true when legacy public flag is false", () => {
    expect(isPrivatePost({ public: false })).toBe(true);
  });

  it("returns false when private indicators are missing", () => {
    expect(isPrivatePost({})).toBe(false);
  });
});

describe("parseSEO", () => {
  it("returns undefined when no seo-related fields are present", () => {
    expect(parseSEO({})).toBeUndefined();
    expect(parseSEO({ seo: {} })).toBeUndefined();
  });

  it("returns partial seo values when provided", () => {
    expect(parseSEO({ seo: { title: "My SEO Title", description: "My SEO Description" } })).toEqual({
      title: "My SEO Title",
      description: "My SEO Description",
    });
  });

  it("uses post image fallback for OG and Twitter images", () => {
    expect(parseSEO({ image: "/cover.png" })).toEqual({
      ogImage: "/cover.png",
      twitterImage: "/cover.png",
    });
  });

  it("ignores seo fields with invalid types", () => {
    expect(
      parseSEO({
        seo: {
          title: 123,
          description: false,
          keywords: ["valid", 100, null],
          ogImageWidth: "1200",
          ogImageHeight: "630",
          twitterCard: 10,
          noindex: "false",
        },
      }),
    ).toEqual({
      keywords: ["valid"],
    });
  });
});
