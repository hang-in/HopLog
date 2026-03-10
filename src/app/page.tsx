import PostList from "@/components/PostList";
import ActivityGrid from "@/components/ActivityGrid";
import { getAllPosts } from "@/lib/posts";
import { getConfig } from "@/lib/config";

export default function Home() {
  const posts = getAllPosts();
  const config = getConfig();
  const { hero, profile } = config;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-muted/30 px-6 py-14 sm:p-16 border border-border/50">
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
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.25]" dangerouslySetInnerHTML={{ __html: hero.title }} />
          <p className="max-w-[85%] sm:max-w-[70%] text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: hero.description }} />
        </div>
      </section>

      <PostList initialPosts={posts} />
      <ActivityGrid githubUsername={profile.githubUsername} blogPosts={posts} />
    </div>
  );
}
