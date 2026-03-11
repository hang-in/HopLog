import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface ProfileConfig {
  profile: {
    name: string;
    role: string;
    email: string;
    github: string;
    githubUsername: string;
    bio: string;
  };
  social: { platform: string; url: string }[];
  experience: {
    company: string;
    position: string;
    period: string;
    description: string;
  }[];
  skills: string[];
}

export interface GiscusInputConfig {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
  mapping?: string;
  strict?: boolean;
  reactionsEnabled?: boolean;
  inputPosition?: string;
  lang?: string;
}

export interface CommentsInputConfig {
  enabled?: boolean;
  giscus?: GiscusInputConfig;
}

export interface GiscusResolvedConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  strict: boolean;
  reactionsEnabled: boolean;
  inputPosition: "top" | "bottom";
  lang: string;
}

export interface CommentsResolvedConfig {
  enabled: boolean;
  giscus: GiscusResolvedConfig;
}

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    titleTemplate: string;
  };
  faq?: {
    enabled?: boolean;
  };
  performance?: {
    postsCacheTtlSeconds?: number;
  };
  hero: {
    title: string;
    description: string;
    background: { image: string; opacity: number };
  };
  typography?: {
    lineHeight?: number;
    fontFamily?: string;
    fontUrl?: string;
  };
  search?: SearchConfig;
  comments?: CommentsInputConfig;
  analytics?: AnalyticsConfig;
}

export type FullConfig = SiteConfig & ProfileConfig;

export interface SEORobotsRuleConfig {
  userAgent: string;
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface SEORobotsConfig {
  policy?: string;
  rules?: SEORobotsRuleConfig[];
}

export interface SEOConfig {
  host?: string;
  siteUrl: string;
  keywords: string[];
  language: string;
  robots: SEORobotsConfig;
  openGraph: {
    type: string;
    siteName: string;
    title: string;
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
  };
  twitter: {
    card: "summary_large_image" | "summary" | "player" | "app";
    site: string;
    creator: string;
    image: string;
  };
}

export interface AnalyticsProviderConfig {
  enabled?: boolean;
}

export interface GoogleAnalyticsConfig extends AnalyticsProviderConfig {
  measurementIdEnv?: string;
}

export interface MetaPixelConfig extends AnalyticsProviderConfig {
  pixelIdEnv?: string;
}

export interface SentryAnalyticsConfig extends AnalyticsProviderConfig {
  dsnEnv?: string;
  environmentEnv?: string;
  tracesSampleRate?: number;
}

export interface AnalyticsConfig {
  enabled?: boolean;
  debug?: boolean;
  ga?: GoogleAnalyticsConfig;
  metaPixel?: MetaPixelConfig;
  sentry?: SentryAnalyticsConfig;
}

export interface AnalyticsRuntimeProviderConfig {
  enabled: boolean;
}

export interface GoogleAnalyticsRuntimeConfig extends AnalyticsRuntimeProviderConfig {
  measurementId?: string;
}

export interface MetaPixelRuntimeConfig extends AnalyticsRuntimeProviderConfig {
  pixelId?: string;
}

export interface SentryRuntimeConfig extends AnalyticsRuntimeProviderConfig {
  dsn?: string;
  environment?: string;
  tracesSampleRate: number;
}

export interface AnalyticsRuntimeConfig {
  enabled: boolean;
  debug: boolean;
  ga: GoogleAnalyticsRuntimeConfig;
  metaPixel: MetaPixelRuntimeConfig;
  sentry: SentryRuntimeConfig;
}

export interface MeilisearchInputConfig {
  hostEnv?: string;
  searchKeyEnv?: string;
  adminKeyEnv?: string;
  indexName?: string;
}

export interface SearchConfig {
  provider?: "local" | "meilisearch";
  meilisearch?: MeilisearchInputConfig;
}

export interface SearchRuntimeConfig {
  provider: "local" | "meilisearch";
  meilisearch: {
    host: string;
    searchKey: string;
    indexName: string;
  } | null;
}

export interface SearchSyncConfig {
  host: string;
  adminKey: string;
  indexName: string;
}

function loadYaml<T>(filePath: string): T {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents) as T;
  } catch {
    throw new Error(`Failed to load ${path.basename(filePath)} at ${filePath}`);
  }
}

function readEnvValue(key?: string): string | undefined {
  if (!key) {
    return undefined;
  }

  const value = process.env[key];

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeSampleRate(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 1;
  }

  return Math.min(1, Math.max(0, value));
}

export function getConfig(): FullConfig {
  const contentDir = process.env.CONTENT_DIR || "content";
  const basePath = path.join(process.cwd(), contentDir);

  const siteConfig = loadYaml<SiteConfig>(path.join(basePath, "config.yml"));
  const profileConfig = loadYaml<ProfileConfig>(
    path.join(basePath, "profile.yml"),
  );

  return { ...siteConfig, ...profileConfig };
}

export function getPostsCacheTtlMs(): number {
  const ttlSeconds = getConfig().performance?.postsCacheTtlSeconds;

  if (typeof ttlSeconds !== "number" || Number.isNaN(ttlSeconds)) {
    return 60_000;
  }

  return Math.max(0, ttlSeconds) * 1000;
}

function resolveMeilisearchConfig() {
  const search = getConfig().search;
  const meilisearch = search?.meilisearch;

  return {
    provider: search?.provider === "meilisearch" ? "meilisearch" : "local",
    host: readEnvValue(meilisearch?.hostEnv),
    searchKey: readEnvValue(meilisearch?.searchKeyEnv),
    adminKey: readEnvValue(meilisearch?.adminKeyEnv),
    indexName: meilisearch?.indexName?.trim() || "posts",
  };
}

export function getSearchRuntimeConfig(): SearchRuntimeConfig {
  const meilisearch = resolveMeilisearchConfig();
  const enabled = meilisearch.provider === "meilisearch"
    && Boolean(meilisearch.host)
    && Boolean(meilisearch.searchKey);

  if (!enabled) {
    return {
      provider: "local",
      meilisearch: null,
    };
  }

  return {
    provider: "meilisearch",
    meilisearch: {
      host: meilisearch.host ?? "",
      searchKey: meilisearch.searchKey ?? "",
      indexName: meilisearch.indexName,
    },
  };
}

export function getSearchSyncConfig(): SearchSyncConfig | null {
  const meilisearch = resolveMeilisearchConfig();
  const enabled = meilisearch.provider === "meilisearch"
    && Boolean(meilisearch.host)
    && Boolean(meilisearch.adminKey);

  if (!enabled) {
    return null;
  }

  return {
    host: meilisearch.host ?? "",
    adminKey: meilisearch.adminKey ?? "",
    indexName: meilisearch.indexName,
  };
}

const VALID_GISCUS_MAPPINGS: GiscusResolvedConfig["mapping"][] = [
  "pathname", "url", "title", "og:title", "specific", "number",
];

export function getCommentsConfig(): CommentsResolvedConfig {
  const comments = getConfig().comments;
  const giscus = comments?.giscus;
  const rawMapping = giscus?.mapping ?? "pathname";

  return {
    enabled: comments?.enabled === true,
    giscus: {
      repo: giscus?.repo ?? "",
      repoId: giscus?.repoId ?? "",
      category: giscus?.category ?? "Announcements",
      categoryId: giscus?.categoryId ?? "",
      mapping: VALID_GISCUS_MAPPINGS.find((m) => m === rawMapping) ?? "pathname",
      strict: giscus?.strict === true,
      reactionsEnabled: giscus?.reactionsEnabled !== false,
      inputPosition: giscus?.inputPosition === "bottom" ? "bottom" : "top",
      lang: giscus?.lang ?? "",
    },
  };
}

export function getAnalyticsRuntimeConfig(): AnalyticsRuntimeConfig {
  const analytics = getConfig().analytics;
  const analyticsEnabled = analytics?.enabled !== false;
  const debug = analytics?.debug === true;

  const gaMeasurementId = readEnvValue(analytics?.ga?.measurementIdEnv);
  const metaPixelId = readEnvValue(analytics?.metaPixel?.pixelIdEnv);
  const sentryDsn = readEnvValue(analytics?.sentry?.dsnEnv);
  const sentryEnvironment = readEnvValue(analytics?.sentry?.environmentEnv);

  return {
    enabled: analyticsEnabled,
    debug,
    ga: {
      enabled: analyticsEnabled && analytics?.ga?.enabled === true && Boolean(gaMeasurementId),
      measurementId: gaMeasurementId,
    },
    metaPixel: {
      enabled: analyticsEnabled && analytics?.metaPixel?.enabled === true && Boolean(metaPixelId),
      pixelId: metaPixelId,
    },
    sentry: {
      enabled: analyticsEnabled && analytics?.sentry?.enabled === true && Boolean(sentryDsn),
      dsn: sentryDsn,
      environment: sentryEnvironment,
      tracesSampleRate: normalizeSampleRate(analytics?.sentry?.tracesSampleRate),
    },
  };
}

export function getSEOConfig(): SEOConfig {
  const contentDir = process.env.CONTENT_DIR || "content";
  const configPath = path.join(process.cwd(), contentDir, "seo.yml");
  return loadYaml<SEOConfig>(configPath);
}

export function getSiteHost(): string {
  const seo = getSEOConfig();
  const rawHost = seo.host || seo.siteUrl || "https://example.com";

  try {
    return new URL(rawHost).origin;
  } catch {
    return new URL(`https://${rawHost}`).origin;
  }
}

export function parseRobotsPolicy(policy?: string): {
  index: boolean;
  follow: boolean;
} {
  const normalized = policy?.toLowerCase() ?? "index, follow";

  return {
    index: !normalized.includes("noindex"),
    follow: !normalized.includes("nofollow"),
  };
}
