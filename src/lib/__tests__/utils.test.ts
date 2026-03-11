import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("returns an empty string for empty input", () => {
    expect(cn()).toBe("");
  });

  it("merges conflicting Tailwind utility classes", () => {
    expect(cn("p-2", "p-4", "text-sm", "text-lg")).toBe("p-4 text-lg");
  });

  it("handles conditional class inputs", () => {
    expect(cn("base", { hidden: false, block: true }, ["mt-2", "text-sm"]))
      .toBe("base block mt-2 text-sm");
  });

  it("ignores undefined and null class values", () => {
    expect(cn(undefined, null, "text-red-500")).toBe("text-red-500");
  });
});
