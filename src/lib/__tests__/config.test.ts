import { afterEach, describe, expect, it } from "vitest";

import { normalizeSampleRate, parseRobotsPolicy, readEnvValue } from "@/lib/config";

describe("parseRobotsPolicy", () => {
  it("uses index/follow defaults for undefined policy", () => {
    expect(parseRobotsPolicy(undefined)).toEqual({ index: true, follow: true });
  });

  it("parses index, follow", () => {
    expect(parseRobotsPolicy("index, follow")).toEqual({ index: true, follow: true });
  });

  it("parses noindex, follow", () => {
    expect(parseRobotsPolicy("noindex, follow")).toEqual({ index: false, follow: true });
  });

  it("parses noindex, nofollow", () => {
    expect(parseRobotsPolicy("noindex, nofollow")).toEqual({ index: false, follow: false });
  });

  it("is case-insensitive", () => {
    expect(parseRobotsPolicy("NOINDEX, NOFOLLOW")).toEqual({ index: false, follow: false });
  });
});

describe("normalizeSampleRate", () => {
  it("returns 1 for undefined", () => {
    expect(normalizeSampleRate(undefined)).toBe(1);
  });

  it("returns 1 for NaN", () => {
    expect(normalizeSampleRate(Number.NaN)).toBe(1);
  });

  it("clamps negative numbers to 0", () => {
    expect(normalizeSampleRate(-0.5)).toBe(0);
  });

  it("clamps values over 1 to 1", () => {
    expect(normalizeSampleRate(1.7)).toBe(1);
  });

  it("returns in-range values unchanged", () => {
    expect(normalizeSampleRate(0.5)).toBe(0.5);
  });
});

describe("readEnvValue", () => {
  const key = "HOPLOG_TEST_ENV_KEY";

  afterEach(() => {
    delete process.env[key];
  });

  it("returns undefined when key is undefined", () => {
    expect(readEnvValue(undefined)).toBeUndefined();
  });

  it("returns trimmed env value", () => {
    process.env[key] = "  hello  ";
    expect(readEnvValue(key)).toBe("hello");
  });

  it("returns undefined for empty or whitespace-only values", () => {
    process.env[key] = "   ";
    expect(readEnvValue(key)).toBeUndefined();
  });
});
