import { MetadataRoute } from "next";
import { hasFAQContent } from "@/lib/faq";
import { getAllPosts } from "@/lib/posts";
import { getSiteHost } from "@/lib/config";

function toIsoDate(date: string): string {
  const normalized = date.replace(/\./g, "-");
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const host = getSiteHost();
  const posts = getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: host,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${host}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...(hasFAQContent()
      ? [
          {
            url: `${host}/faq`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : []),
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${host}/posts/${post.id}`,
    lastModified: toIsoDate(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
