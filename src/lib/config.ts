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

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    titleTemplate: string;
    url: string;
    keywords: string[];
    language: string;
  };
  hero: {
    title: string;
    description: string;
    background: { image: string; opacity: number };
  };
  branding: {
    favicon: {
      text: string;
      color: string;
      textColor: string;
      accentColor: string;
    };
  };
}

export type FullConfig = SiteConfig & ProfileConfig;

export interface SEOConfig {
  siteUrl: string;
  keywords: string[];
  language: string;
  robots: string;
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

function loadYaml<T>(filePath: string): T {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents) as T;
  } catch (e) {
    throw new Error(`Failed to load ${path.basename(filePath)} at ${filePath}`);
  }
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

export function getSEOConfig(): SEOConfig {
  const contentDir = process.env.CONTENT_DIR || "content";
  const configPath = path.join(process.cwd(), contentDir, "seo.yml");
  return loadYaml<SEOConfig>(configPath);
}
