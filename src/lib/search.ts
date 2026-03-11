import { SearchRuntimeConfig, getSearchRuntimeConfig } from "@/lib/config";
import { PostSearchItem } from "@/lib/data";
import { getPostSearchItems } from "@/lib/posts";
import { SearchProviderMode, searchPostSearchItems } from "@/lib/search-shared";

interface MeilisearchResponse {
  hits?: Array<{
    id: string;
    title: string;
    category: string[];
    excerpt: string;
  }>;
}

export abstract class SearchProvider {
  constructor(readonly mode: SearchProviderMode) {}

  async getInitialItems(): Promise<PostSearchItem[]> {
    return getPostSearchItems();
  }

  abstract search(query: string): Promise<PostSearchItem[]>;

  getQueryCacheControl(query: string): string {
    return query.trim() ? "no-store" : "public, max-age=60, s-maxage=60";
  }
}

export class DefaultSearchProvider extends SearchProvider {
  constructor() {
    super("local");
  }

  async search(query: string): Promise<PostSearchItem[]> {
    return searchPostSearchItems(getPostSearchItems(), query);
  }
}

export class MeilisearchSearchProvider extends SearchProvider {
  constructor(
    private readonly config: NonNullable<SearchRuntimeConfig["meilisearch"]>,
    private readonly fallbackProvider: SearchProvider,
  ) {
    super("meilisearch");
  }

  override getQueryCacheControl(): string {
    return "no-store";
  }

  override async search(query: string): Promise<PostSearchItem[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return this.fallbackProvider.getInitialItems();
    }

    const remoteHits = await fetch(`${this.config.host}/indexes/${this.config.indexName}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.searchKey}`,
      },
      body: JSON.stringify({
        q: normalizedQuery,
        attributesToRetrieve: ["id", "title", "category", "excerpt"],
        limit: 20,
      }),
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const data = await response.json() as MeilisearchResponse;
        return data.hits ?? [];
      })
      .catch(() => null);

    if (remoteHits) {
      return remoteHits;
    }

    return this.fallbackProvider.search(normalizedQuery);
  }
}

export function createSearchProvider(config: SearchRuntimeConfig = getSearchRuntimeConfig()): SearchProvider {
  const defaultProvider = new DefaultSearchProvider();

  if (config.provider === "meilisearch" && config.meilisearch) {
    return new MeilisearchSearchProvider(config.meilisearch, defaultProvider);
  }

  return defaultProvider;
}

export function getSearchProviderMode(config: SearchRuntimeConfig = getSearchRuntimeConfig()): SearchProviderMode {
  return createSearchProvider(config).mode;
}
