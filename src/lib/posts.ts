import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostSEO } from "./data";
import { getPostsCacheTtlMs } from "./config";

export interface PostDetail extends Post {
  content: string;
}

const contentDir = process.env.CONTENT_DIR || "content";
const postsDirectory = path.join(process.cwd(), contentDir, "posts");

let postsCache: { data: Post[]; expiresAt: number } | null = null;

function getMarkdownFilePaths(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFilePaths(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function getPostIdFromPath(filePath: string): string {
  const relativePath = path.relative(postsDirectory, filePath);
  return relativePath.replace(/\.md$/, "").split(path.sep).join("/");
}

function isPrivatePost(frontmatter: Record<string, unknown>): boolean {
  if (frontmatter.visibility === "private") {
    return true;
  }

  if (frontmatter.visibility === "public") {
    return false;
  }

  if (frontmatter.public === false) {
    return true;
  }

  return false;
}

function parseSEO(data: Record<string, unknown>): PostSEO | undefined {
  const seo = data.seo as Record<string, unknown> | undefined;

  // Collect all SEO-related fields
  const result: PostSEO = {};
  let hasAny = false;

  // From nested seo object
  if (seo && typeof seo === "object") {
    if (typeof seo.title === "string") {
      result.title = seo.title;
      hasAny = true;
    }
    if (typeof seo.description === "string") {
      result.description = seo.description;
      hasAny = true;
    }
    if (Array.isArray(seo.keywords)) {
      result.keywords = seo.keywords.filter(
        (k): k is string => typeof k === "string",
      );
      hasAny = true;
    }
    if (typeof seo.ogTitle === "string") {
      result.ogTitle = seo.ogTitle;
      hasAny = true;
    }
    if (typeof seo.ogDescription === "string") {
      result.ogDescription = seo.ogDescription;
      hasAny = true;
    }
    if (typeof seo.ogImage === "string") {
      result.ogImage = seo.ogImage;
      hasAny = true;
    }
    if (typeof seo.ogImageWidth === "number") {
      result.ogImageWidth = seo.ogImageWidth;
      hasAny = true;
    }
    if (typeof seo.ogImageHeight === "number") {
      result.ogImageHeight = seo.ogImageHeight;
      hasAny = true;
    }
    if (typeof seo.twitterCard === "string") {
      result.twitterCard = seo.twitterCard as PostSEO["twitterCard"];
      hasAny = true;
    }
    if (typeof seo.twitterTitle === "string") {
      result.twitterTitle = seo.twitterTitle;
      hasAny = true;
    }
    if (typeof seo.twitterDescription === "string") {
      result.twitterDescription = seo.twitterDescription;
      hasAny = true;
    }
    if (typeof seo.twitterImage === "string") {
      result.twitterImage = seo.twitterImage;
      hasAny = true;
    }
    if (typeof seo.canonical === "string") {
      result.canonical = seo.canonical;
      hasAny = true;
    }
    if (typeof seo.noindex === "boolean") {
      result.noindex = seo.noindex;
      hasAny = true;
    }
  }

  // Auto-fallback: if post has a thumbnail image, use it as OG/Twitter image unless explicitly set
  if (typeof data.image === "string" && data.image) {
    if (!result.ogImage) {
      result.ogImage = data.image;
      hasAny = true;
    }
    if (!result.twitterImage) {
      result.twitterImage = data.image;
      hasAny = true;
    }
  }

  return hasAny ? result : undefined;
}

export function getAllPosts(): Post[] {
  const ttlMs = getPostsCacheTtlMs();

  if (ttlMs > 0 && postsCache && postsCache.expiresAt > Date.now()) {
    return postsCache.data;
  }

  const markdownFiles = getMarkdownFilePaths(postsDirectory);

  const allPostsData = markdownFiles
    .map((fullPath) => {
      const id = getPostIdFromPath(fullPath);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);

      if (isPrivatePost(matterResult.data)) {
        return null;
      }

      let categories: string[] = [];
      if (Array.isArray(matterResult.data.category)) {
        categories = matterResult.data.category;
      } else if (typeof matterResult.data.category === "string") {
        categories = matterResult.data.category.split(",").map((c) => c.trim());
      }

      const seo = parseSEO(matterResult.data);

      return {
        id,
        ...(matterResult.data as Omit<Post, "id" | "category" | "seo">),
        category: categories,
        ...(seo ? { seo } : {}),
      } as Post;
    })
    .filter((post): post is Post => post !== null);

  const sortedPosts = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));

  if (ttlMs > 0) {
    postsCache = {
      data: sortedPosts,
      expiresAt: Date.now() + ttlMs,
    };
  } else {
    postsCache = null;
  }

  return sortedPosts;
}

export function getAdjacentPosts(id: string): {
  prev: Post | null;
  next: Post | null;
} {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: posts[idx + 1] ?? null,
    next: posts[idx - 1] ?? null,
  };
}

export function getPostById(id: string): PostDetail | null {
  const fullPath = getMarkdownFilePaths(postsDirectory).find(
    (filePath) => getPostIdFromPath(filePath) === id,
  );
  if (!fullPath || !fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  if (isPrivatePost(matterResult.data)) {
    return null;
  }

  let categories: string[] = [];
  if (Array.isArray(matterResult.data.category)) {
    categories = matterResult.data.category;
  } else if (typeof matterResult.data.category === "string") {
    categories = matterResult.data.category.split(",").map((c) => c.trim());
  }

  const seo = parseSEO(matterResult.data);

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as Omit<Post, "id" | "category" | "seo">),
    category: categories,
    ...(seo ? { seo } : {}),
  } as PostDetail;
}
