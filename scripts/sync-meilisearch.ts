import { getSearchSyncConfig } from "../src/lib/config";
import { getPostSearchSyncItems } from "../src/lib/posts";

interface MeilisearchTaskResponse {
  taskUid?: number;
}

interface MeilisearchTaskStatus {
  status: "enqueued" | "processing" | "succeeded" | "failed" | "canceled";
  error?: {
    message?: string;
  };
}

async function meilisearchRequest(
  host: string,
  apiKey: string,
  endpoint: string,
  init: RequestInit,
  allowedStatuses: number[] = [200, 201, 202],
) {
  const response = await fetch(`${host}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!allowedStatuses.includes(response.status)) {
    const text = await response.text();
    throw new Error(`Meilisearch request failed (${response.status}): ${text}`);
  }

  return response;
}

async function waitForTask(host: string, apiKey: string, taskUid: number) {
  for (;;) {
    const response = await meilisearchRequest(host, apiKey, `/tasks/${taskUid}`, { method: "GET" });
    const task = (await response.json()) as MeilisearchTaskStatus;

    if (task.status === "succeeded") {
      return;
    }

    if (task.status === "failed" || task.status === "canceled") {
      throw new Error(task.error?.message ?? `Meilisearch task ${taskUid} did not succeed.`);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

interface MeilisearchDocsPage {
  results: { meiliId: string }[];
  offset: number;
  limit: number;
  total: number;
}

async function ensureIndex(host: string, apiKey: string, indexName: string) {
  const response = await meilisearchRequest(
    host,
    apiKey,
    "/indexes",
    {
      method: "POST",
      body: JSON.stringify({ uid: indexName, primaryKey: "meiliId" }),
    },
    [200, 201, 202, 409],
  );
  const task = (await response.json()) as MeilisearchTaskResponse;
  if (task.taskUid) {
    await waitForTask(host, apiKey, task.taskUid);
  }
}

async function getAllDocumentIds(host: string, apiKey: string, indexName: string): Promise<Set<string>> {
  const ids = new Set<string>();
  let offset = 0;
  const limit = 1000;
  for (;;) {
    const response = await meilisearchRequest(
      host,
      apiKey,
      `/indexes/${indexName}/documents?fields=meiliId&offset=${offset}&limit=${limit}`,
      { method: "GET" },
    );
    const page = (await response.json()) as MeilisearchDocsPage;
    for (const doc of page.results) {
      ids.add(doc.meiliId);
    }
    if (offset + limit >= page.total) break;
    offset += limit;
  }
  return ids;
}

async function main() {
  const config = getSearchSyncConfig();

  if (!config) {
    throw new Error(
      "Meilisearch sync is unavailable. Set search.provider to 'meilisearch' and configure MEILISEARCH_HOST plus MEILISEARCH_ADMIN_KEY.",
    );
  }

  const items = getPostSearchSyncItems();
  const docs = items.map((item) => ({
    ...item,
    meiliId: item.id.replaceAll("/", "-").replace(/[^a-zA-Z0-9\-_]/g, ""),
  }));

  // Ensure index exists (idempotent)
  await ensureIndex(config.host, config.adminKey, config.indexName);

  // Update settings (idempotent PATCH)
  const settingsResponse = await meilisearchRequest(
    config.host,
    config.adminKey,
    `/indexes/${config.indexName}/settings`,
    {
      method: "PATCH",
      body: JSON.stringify({
        searchableAttributes: ["title", "category", "excerpt", "content"],
        displayedAttributes: ["id", "title", "date", "category", "excerpt"],
        filterableAttributes: ["category"],
        sortableAttributes: ["date"],
      }),
    },
  );
  const settingsTask = (await settingsResponse.json()) as MeilisearchTaskResponse;
  if (settingsTask.taskUid) {
    await waitForTask(config.host, config.adminKey, settingsTask.taskUid);
  }

  // Upsert all documents (no index drop — zero downtime)
  if (docs.length > 0) {
    const upsertResponse = await meilisearchRequest(
      config.host,
      config.adminKey,
      `/indexes/${config.indexName}/documents`,
      { method: "POST", body: JSON.stringify(docs) },
    );
    const upsertTask = (await upsertResponse.json()) as MeilisearchTaskResponse;
    if (upsertTask.taskUid) {
      await waitForTask(config.host, config.adminKey, upsertTask.taskUid);
    }
  }

  // Remove stale documents
  const currentIds = new Set(docs.map((d) => d.meiliId));
  const existingIds = await getAllDocumentIds(config.host, config.adminKey, config.indexName);
  const staleIds = [...existingIds].filter((id) => !currentIds.has(id));

  if (staleIds.length > 0) {
    const deleteResponse = await meilisearchRequest(
      config.host,
      config.adminKey,
      `/indexes/${config.indexName}/documents/delete-batch`,
      { method: "POST", body: JSON.stringify(staleIds) },
    );
    const deleteTask = (await deleteResponse.json()) as MeilisearchTaskResponse;
    if (deleteTask.taskUid) {
      await waitForTask(config.host, config.adminKey, deleteTask.taskUid);
    }
    console.log(`Removed ${staleIds.length} stale documents.`);
  }

  console.log(`Synced ${docs.length} posts to Meilisearch index '${config.indexName}'.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
