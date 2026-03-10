import { MetadataRoute } from "next";
import { getSEOConfig, getSiteHost, type SEORobotsRuleConfig } from "@/lib/config";

const defaultRules: SEORobotsRuleConfig[] = [
  { userAgent: "*", allow: "/" },
  { userAgent: "GPTBot", allow: "/" },
  { userAgent: "ChatGPT-User", allow: "/" },
  { userAgent: "OAI-SearchBot", allow: "/" },
  { userAgent: "ClaudeBot", allow: "/" },
  { userAgent: "PerplexityBot", allow: "/" },
  { userAgent: "Googlebot", allow: "/" },
  { userAgent: "Google-Extended", allow: "/" },
  { userAgent: "Bingbot", allow: "/" },
  { userAgent: "Slurp", allow: "/" },
  { userAgent: "DuckDuckBot", allow: "/" },
  { userAgent: "Yeti", allow: "/" },
];

function normalizeRule(rule: SEORobotsRuleConfig) {
  return {
    userAgent: rule.userAgent,
    allow: rule.allow,
    disallow: rule.disallow,
    crawlDelay: rule.crawlDelay,
  };
}

export default function robots(): MetadataRoute.Robots {
  const host = getSiteHost();
  const seo = getSEOConfig();
  const rules = (seo.robots.rules?.length ? seo.robots.rules : defaultRules).map(normalizeRule);

  return {
    rules,
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
