import { describe, expect, it } from "vitest";

import {
  formatMessage,
  getHtmlLang,
  getMessageCatalog,
  getUIStrings,
  isLocale,
  parseLocaleCookie,
} from "@/lib/i18n";

describe("getHtmlLang", () => {
  it("returns html lang for all supported locales", () => {
    expect(getHtmlLang("en")).toBe("en");
    expect(getHtmlLang("ko")).toBe("ko");
    expect(getHtmlLang("ja")).toBe("ja");
    expect(getHtmlLang("zh")).toBe("zh-CN");
  });
});

describe("isLocale", () => {
  it("returns true for valid locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ko")).toBe(true);
    expect(isLocale("ja")).toBe(true);
    expect(isLocale("zh")).toBe(true);
  });

  it("returns false for invalid locale values", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("EN")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

describe("parseLocaleCookie", () => {
  it("returns default locale for undefined or empty cookie", () => {
    expect(parseLocaleCookie(undefined)).toBe("en");
    expect(parseLocaleCookie("")).toBe("en");
  });

  it("returns cookie locale when it is valid", () => {
    expect(parseLocaleCookie("ko")).toBe("ko");
  });

  it("falls back to default locale for invalid cookie value", () => {
    expect(parseLocaleCookie("fr")).toBe("en");
  });
});

describe("formatMessage", () => {
  it("replaces placeholders with provided values", () => {
    expect(formatMessage("{count} posts", { count: 3 })).toBe("3 posts");
  });

  it("keeps placeholder text when value is missing", () => {
    expect(formatMessage("{count} posts by {author}", { count: 3 })).toBe("3 posts by {author}");
  });
});

describe("getMessageCatalog", () => {
  it("returns locale catalog for supported locales", () => {
    expect(getMessageCatalog("en").common.navigation).toBe("Navigation");
    expect(getMessageCatalog("ko").common.navigation).toBe("탐색");
    expect(getMessageCatalog("ja").common.navigation).toBe("ナビゲーション");
    expect(getMessageCatalog("zh").common.navigation).toBe("导航");
  });

  it("falls back to english for invalid locale", () => {
    expect(getMessageCatalog("fr").common.navigation).toBe("Navigation");
  });
});

describe("getUIStrings", () => {
  it("returns UI strings for all locales", () => {
    expect(getUIStrings("en").common.navigation).toBe("Navigation");
    expect(getUIStrings("ko").common.navigation).toBe("탐색");
    expect(getUIStrings("ja").common.navigation).toBe("ナビゲーション");
    expect(getUIStrings("zh").common.navigation).toBe("导航");
  });

  it("falls back to english for invalid locale", () => {
    expect(getUIStrings("fr").common.navigation).toBe("Navigation");
  });

  it("formats activity labels with different counts", () => {
    const ui = getUIStrings("en");
    expect(ui.activity.postsLabel(0)).toBe("0 posts");
    expect(ui.activity.postsLabel(1)).toBe("1 posts");
    expect(ui.activity.postsLabel(100)).toBe("100 posts");
    expect(ui.activity.contributionsLabel(0)).toBe("0 contributions");
    expect(ui.activity.contributionsLabel(1)).toBe("1 contributions");
    expect(ui.activity.contributionsLabel(100)).toBe("100 contributions");
  });
});
