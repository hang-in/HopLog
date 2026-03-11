import { Fragment, type ReactElement } from "react";
import PostList from "@/components/PostList";
import ActivityGrid from "@/components/ActivityGrid";
import { getPostActivityItems, getPostCategories, getPostListPage } from "@/lib/posts";
import { getConfig } from "@/lib/config";

function renderInlineMarkup(content: string) {
  const lines = content.split(/<br\s*\/?>/i);

  return lines.flatMap((line) => {
    const nodes: Array<string | ReactElement> = [];
    const spanPattern = /<span class="([^"]+)">([\s\S]*?)<\/span>/g;
    let lastIndex = 0;
    const lineKey = `${line}-${lastIndex}`;

    for (const match of line.matchAll(spanPattern)) {
      const matchIndex = match.index ?? 0;
      if (matchIndex > lastIndex) {
        nodes.push(line.slice(lastIndex, matchIndex));
      }

      nodes.push(
        <span key={`span-${lineKey}-${matchIndex}`} className={match[1]}>
          {match[2]}
        </span>,
      );

      lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < line.length) {
      nodes.push(line.slice(lastIndex));
    }

    if (line !== lines[lines.length - 1]) {
      nodes.push(<br key={`br-${lineKey}`} />);
    }

    return nodes.map((node, nodeIndex) => (
      <Fragment key={typeof node === "string" ? `text-${lineKey}-${nodeIndex}-${node}` : node.key?.toString() ?? `node-${lineKey}-${nodeIndex}`}>
        {node}
      </Fragment>
    ));
  });
}

export default function Home() {
  const postListPage = getPostListPage();
  const postActivityItems = getPostActivityItems();
  const postCategories = getPostCategories();
  const config = getConfig();
  const { hero, profile } = config;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] bg-muted/30 px-5 py-10 sm:p-12 border border-border/50">
        {hero.background?.image && (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${hero.background.image})`,
              opacity: hero.background.opacity
            }}
          />
        )}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background/80 to-transparent dark:from-background/90" />
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.25]">{renderInlineMarkup(hero.title)}</h1>
          <p className="max-w-[85%] sm:max-w-[70%] text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed font-medium">{renderInlineMarkup(hero.description)}</p>
        </div>
      </section>

      <PostList
        initialPosts={postListPage.items}
        initialTotalCount={postListPage.totalCount}
        categories={postCategories}
      />
      <ActivityGrid githubUsername={profile.githubUsername} activityItems={postActivityItems} />
    </div>
  );
}
