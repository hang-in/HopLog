import { describe, expect, it } from "vitest";

import type { PostSearchItem } from "@/lib/data";
import { scoreFzfLikeMatch, searchPostSearchItems } from "@/lib/search-shared";

const ITEMS: PostSearchItem[] = [
  {
    id: "alpha-guide",
    title: "Alpha Guide",
    category: ["Guides"],
    excerpt: "A complete alpha walkthrough",
  },
  {
    id: "beta-notes",
    title: "Beta Notes",
    category: ["Notes"],
    excerpt: "Quick beta notes",
  },
  {
    id: "gamma-log",
    title: "Gamma Log",
    category: ["Journal"],
    excerpt: "Daily logbook",
  },
];

describe("scoreFzfLikeMatch", () => {
  it("returns 1 when query is empty", () => {
    expect(scoreFzfLikeMatch("Alpha Guide", "")).toBe(1);
    expect(scoreFzfLikeMatch("Alpha Guide", "   ")).toBe(1);
  });

  it("returns 0 when candidate is empty", () => {
    expect(scoreFzfLikeMatch("", "alpha")).toBe(0);
  });

  it("scores positive for substring matches", () => {
    expect(scoreFzfLikeMatch("Alpha Guide", "pha")).toBeGreaterThan(0);
  });

  it("applies boundary bonuses", () => {
    const boundaryScore = scoreFzfLikeMatch("my post", "po");
    const nonBoundaryScore = scoreFzfLikeMatch("mypost", "po");
    expect(boundaryScore).toBeGreaterThan(nonBoundaryScore);
  });

  it("is case-insensitive", () => {
    expect(scoreFzfLikeMatch("Alpha Guide", "ALPHA")).toBe(scoreFzfLikeMatch("alpha guide", "alpha"));
  });

  it("normalizes repeated whitespace", () => {
    const withExtraSpaces = scoreFzfLikeMatch("alpha    guide", "alpha guide");
    const normalized = scoreFzfLikeMatch("alpha guide", "alpha guide");
    expect(withExtraSpaces).toBe(normalized);
  });
});

describe("searchPostSearchItems", () => {
  it("returns first N items for empty query", () => {
    expect(searchPostSearchItems(ITEMS, "", 2)).toEqual(ITEMS.slice(0, 2));
  });

  it("returns empty array when there are no matches", () => {
    expect(searchPostSearchItems(ITEMS, "zzzz", 10)).toEqual([]);
  });

  it("respects result limit", () => {
    const result = searchPostSearchItems(ITEMS, "a", 1);
    expect(result).toHaveLength(1);
  });

  it("sorts by descending score", () => {
    const rankedItems: PostSearchItem[] = [
      {
        id: "1",
        title: "Alpha",
        category: [],
        excerpt: "",
      },
      {
        id: "2",
        title: "xx a l p h a",
        category: [],
        excerpt: "",
      },
    ];

    const result = searchPostSearchItems(rankedItems, "alpha", 10);
    expect(result.map((item) => item.id)).toEqual(["1", "2"]);
  });

  it("breaks ties by original index", () => {
    const tiedItems: PostSearchItem[] = [
      {
        id: "first",
        title: "Same Title",
        category: ["A"],
        excerpt: "Same excerpt",
      },
      {
        id: "second",
        title: "Same Title",
        category: ["A"],
        excerpt: "Same excerpt",
      },
    ];

    const result = searchPostSearchItems(tiedItems, "same", 10);
    expect(result.map((item) => item.id)).toEqual(["first", "second"]);
  });
});
