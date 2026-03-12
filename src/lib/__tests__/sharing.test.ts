import { describe, expect, it, vi } from "vitest";

import { resolveProviders } from "@/components/sharing/providers";
import { TwitterProvider } from "@/components/sharing/providers/TwitterProvider";
import { FacebookProvider } from "@/components/sharing/providers/FacebookProvider";
import { LinkedInProvider } from "@/components/sharing/providers/LinkedInProvider";
import { CopyLinkProvider } from "@/components/sharing/providers/CopyLinkProvider";
import type { ShareContext } from "@/components/sharing/types";

const context: ShareContext = {
  url: "https://blog.example.com/posts/hello",
  title: "Hello World",
  description: "A test post",
};

describe("resolveProviders", () => {
  it("returns providers in the order specified", () => {
    const providers = resolveProviders(["linkedin", "twitter"]);
    expect(providers).toHaveLength(2);
    expect(providers[0].meta.key).toBe("linkedin");
    expect(providers[1].meta.key).toBe("twitter");
  });

  it("returns empty array for empty input", () => {
    expect(resolveProviders([])).toEqual([]);
  });

  it("returns all 4 providers when all keys given", () => {
    const providers = resolveProviders(["twitter", "facebook", "linkedin", "copyLink"]);
    expect(providers).toHaveLength(4);
    expect(providers.map((p) => p.meta.key)).toEqual(["twitter", "facebook", "linkedin", "copyLink"]);
  });
});

describe("TwitterProvider", () => {
  it("has correct meta", () => {
    const provider = new TwitterProvider();
    expect(provider.meta.key).toBe("twitter");
    expect(provider.meta.label).toBe("Twitter");
  });

  it("opens twitter intent URL", () => {
    const openSpy = vi.fn();
    vi.stubGlobal("window", { open: openSpy });

    new TwitterProvider().share(context);

    expect(openSpy).toHaveBeenCalledOnce();
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("twitter.com/intent/tweet");
    expect(url).toContain("Hello+World");
    expect(url).toContain(encodeURIComponent(context.url));

    vi.unstubAllGlobals();
  });
});

describe("FacebookProvider", () => {
  it("has correct meta", () => {
    const provider = new FacebookProvider();
    expect(provider.meta.key).toBe("facebook");
  });

  it("opens facebook sharer URL", () => {
    const openSpy = vi.fn();
    vi.stubGlobal("window", { open: openSpy });

    new FacebookProvider().share(context);

    expect(openSpy).toHaveBeenCalledOnce();
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("facebook.com/sharer/sharer.php");
    expect(url).toContain(encodeURIComponent(context.url));

    vi.unstubAllGlobals();
  });
});

describe("LinkedInProvider", () => {
  it("has correct meta", () => {
    const provider = new LinkedInProvider();
    expect(provider.meta.key).toBe("linkedin");
  });

  it("opens linkedin sharing URL", () => {
    const openSpy = vi.fn();
    vi.stubGlobal("window", { open: openSpy });

    new LinkedInProvider().share(context);

    expect(openSpy).toHaveBeenCalledOnce();
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("linkedin.com/sharing/share-offsite");
    expect(url).toContain(encodeURIComponent(context.url));

    vi.unstubAllGlobals();
  });
});

describe("CopyLinkProvider", () => {
  it("has correct meta", () => {
    const provider = new CopyLinkProvider();
    expect(provider.meta.key).toBe("copyLink");
  });

  it("copies URL to clipboard", () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText: writeTextSpy } });

    new CopyLinkProvider().share(context);

    expect(writeTextSpy).toHaveBeenCalledWith(context.url);

    vi.unstubAllGlobals();
  });
});
