import { MetadataRoute } from "next";
import { getSEOConfig, getSiteHost, type SEORobotsRuleConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

const defaultRules: SEORobotsRuleConfig[] = [{ userAgent: "*", disallow: "/" }];

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
