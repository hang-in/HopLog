import ActivityGridClient from "@/components/ActivityGridClient";
import { PostActivityItem } from "@/lib/data";
import { getGitHubContributions } from "@/lib/github-contributions";

export default async function ActivityGrid({
  githubUsername,
  activityItems,
}: {
  githubUsername?: string;
  activityItems: PostActivityItem[];
}) {
  const githubActivity = await getGitHubContributions(githubUsername);

  return (
    <ActivityGridClient
      githubUsername={githubUsername}
      activityItems={activityItems}
      githubActivity={githubActivity}
    />
  );
}
