import { describe, expect, it } from "vitest";

import { getFAQForLocale, isValidFAQDocument, type FAQCatalog } from "@/lib/faq";

describe("isValidFAQDocument", () => {
  it("accepts a fully valid FAQ document", () => {
    expect(isValidFAQDocument({
      title: "FAQ",
      description: "Common questions",
      groups: [
        {
          id: "general",
          title: "General",
          items: [
            {
              id: "q1",
              question: "What is HopLog?",
              answer: "A blog.",
            },
          ],
        },
      ],
    })).toBe(true);
  });

  it("rejects documents with an invalid group even when another group is valid", () => {
    expect(isValidFAQDocument({
      title: "FAQ",
      description: "Common questions",
      groups: [
        {
          id: "general",
          title: "General",
          items: [
            {
              id: "q1",
              question: "What is HopLog?",
              answer: "A blog.",
            },
          ],
        },
        {
          id: "",
          title: "Broken group",
          items: [
            {
              id: "q2",
              question: "Broken?",
              answer: "Yes.",
            },
          ],
        },
      ],
    })).toBe(false);
  });

  it("rejects documents with an invalid item even when another item is valid", () => {
    expect(isValidFAQDocument({
      title: "FAQ",
      description: "Common questions",
      groups: [
        {
          id: "general",
          title: "General",
          items: [
            {
              id: "q1",
              question: "What is HopLog?",
              answer: "A blog.",
            },
            {
              id: "q2",
              question: "",
              answer: "Broken item",
            },
          ],
        },
      ],
    })).toBe(false);
  });
});

describe("getFAQForLocale", () => {
  it("falls back to the default locale when the requested locale is unavailable", () => {
    const catalog: FAQCatalog = {
      en: {
        title: "FAQ",
        description: "English FAQ",
        groups: [
          {
            id: "general",
            title: "General",
            items: [
              {
                id: "q1",
                question: "What is HopLog?",
                answer: "A blog.",
              },
            ],
          },
        ],
      },
    };

    expect(getFAQForLocale("ko", catalog)?.description).toBe("English FAQ");
  });
});
