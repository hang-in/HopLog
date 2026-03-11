import { PostSearchItem } from "@/lib/data";
import { SearchProviderMode } from "@/lib/search-shared";

export abstract class CommandPaletteSearchClient {
  constructor(readonly mode: SearchProviderMode) {}

  async loadInitialPosts(): Promise<PostSearchItem[]> {
    const response = await fetch("/api/post-search");

    if (!response.ok) {
      throw new Error("Failed to load posts");
    }

    return response.json() as Promise<PostSearchItem[]>;
  }

  usesRemoteResults(query: string): boolean {
    return this.mode === "meilisearch" && query.trim().length > 0;
  }

  abstract search(query: string, signal: AbortSignal): Promise<PostSearchItem[]>;
}

export class DefaultCommandPaletteSearchClient extends CommandPaletteSearchClient {
  constructor() {
    super("local");
  }

  async search(): Promise<PostSearchItem[]> {
    return [];
  }
}

export class MeilisearchCommandPaletteSearchClient extends CommandPaletteSearchClient {
  constructor() {
    super("meilisearch");
  }

  async search(query: string, signal: AbortSignal): Promise<PostSearchItem[]> {
    const response = await fetch(`/api/post-search?q=${encodeURIComponent(query)}`, {
      signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to search posts");
    }

    return response.json() as Promise<PostSearchItem[]>;
  }
}

export function createCommandPaletteSearchClient(mode: SearchProviderMode): CommandPaletteSearchClient {
  if (mode === "meilisearch") {
    return new MeilisearchCommandPaletteSearchClient();
  }

  return new DefaultCommandPaletteSearchClient();
}
