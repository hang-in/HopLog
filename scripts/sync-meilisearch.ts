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

async function main() {
  const config = getSearchSyncConfig();

  if (!config) {
    throw new Error(
      "Meilisearch sync is unavailable. Set search.provider to 'meilisearch' and configure MEILISEARCH_HOST plus MEILISEARCH_ADMIN_KEY.",
    );
  }

  const items = getPostSearchSyncItems();

  const deleteResponse = await meilisearchRequest(
    config.host,
    config.adminKey,
    `/indexes/${config.indexName}`,
    { method: "DELETE" },
    [200, 202, 404],
  );
  const deleteTask = (await deleteResponse.json()) as MeilisearchTaskResponse;

  if (deleteTask.taskUid) {
    await waitForTask(config.host, config.adminKey, deleteTask.taskUid);
  }

  const createIndexResponse = await meilisearchRequest(
    config.host,
    config.adminKey,
    "/indexes",
    {
      method: "POST",
      body: JSON.stringify({
        uid: config.indexName,
        primaryKey: "meiliId",
      }),
    },
    [201, 202],
  );
  const createIndexTask = (await createIndexResponse.json()) as MeilisearchTaskResponse;

  if (createIndexTask.taskUid) {
    await waitForTask(config.host, config.adminKey, createIndexTask.taskUid);
  }

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

  const documentsResponse = await meilisearchRequest(
    config.host,
    config.adminKey,
    `/indexes/${config.indexName}/documents`,
    {
      method: "POST",
      body: JSON.stringify(
        items.map((item) => ({
          ...item,
          meiliId: item.id.replaceAll("/", "-"),
        })),
      ),
    },
  );
  const documentsTask = (await documentsResponse.json()) as MeilisearchTaskResponse;

  if (documentsTask.taskUid) {
    await waitForTask(config.host, config.adminKey, documentsTask.taskUid);
  }

  console.log(`Synced ${items.length} posts to Meilisearch index '${config.indexName}'.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
