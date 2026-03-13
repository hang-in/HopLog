import fs from "fs";
import path from "path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("api/images route", () => {
  const originalContentDir = process.env.CONTENT_DIR;
  let contentDirPath = "";
  let contentDirRelative = "";

  beforeEach(() => {
    vi.resetModules();
    contentDirPath = fs.mkdtempSync(path.join(process.cwd(), ".tmp-content-"));
    contentDirRelative = path.relative(process.cwd(), contentDirPath);
    fs.mkdirSync(path.join(contentDirPath, "images"), { recursive: true });
    process.env.CONTENT_DIR = contentDirRelative;
  });

  afterEach(() => {
    if (originalContentDir === undefined) {
      delete process.env.CONTENT_DIR;
    } else {
      process.env.CONTENT_DIR = originalContentDir;
    }

    if (contentDirPath) {
      fs.rmSync(contentDirPath, { recursive: true, force: true });
    }
  });

  it("returns an image response for files under the images directory", async () => {
    fs.writeFileSync(path.join(contentDirPath, "images", "hero.png"), "image-data");

    const { GET } = await import("@/app/api/images/[...path]/route");
    const response = await GET(new Request("http://localhost/api/images/hero.png"), {
      params: Promise.resolve({ path: ["hero.png"] }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
  });

  it("rejects traversal attempts outside the images directory", async () => {
    fs.writeFileSync(path.join(contentDirPath, "secret.txt"), "secret");

    const { GET } = await import("@/app/api/images/[...path]/route");
    const response = await GET(new Request("http://localhost/api/images/%2e%2e/secret.txt"), {
      params: Promise.resolve({ path: ["..", "secret.txt"] }),
    });

    expect(response.status).toBe(404);
  });
});
