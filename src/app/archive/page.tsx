import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Post } from "@/lib/data";

export const metadata = {
  title: "아카이브 | HopLog",
  description: "지금까지 작성된 모든 글의 기록입니다.",
};

export default function ArchivePage() {
  const posts = getAllPosts();

  // 연도별로 게시글을 그룹화합니다.
  const groupedPosts = posts.reduce((acc, post) => {
    const year = post.date.split(".")[0]; // "2026.03.11" -> "2026"
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  // 연도를 내림차순(최신순)으로 정렬합니다.
  const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <section className="space-y-6 pt-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          아카이브<span className="text-primary">.</span>
        </h1>
        <p className="text-[16px] text-muted-foreground font-medium">
          지금까지 기록된 총 {posts.length}개의 글입니다.
        </p>
      </section>

      {/* Archive List Grouped by Year */}
      <div className="space-y-20">
        {years.map((year) => (
          <section key={year} className="space-y-6 relative">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-4">
              {year}
            </h2>
            
            <div className="flex flex-col gap-1">
              {groupedPosts[year].map((post) => (
                <article key={post.id}>
                  <Link 
                    href={`/posts/${post.id}`}
                    className="group flex flex-col sm:flex-row sm:items-baseline justify-between py-4 hover:bg-muted/50 transition-colors duration-300 rounded-xl px-4 -mx-4 active:scale-[0.99]"
                  >
                    <div className="space-y-1 max-w-[85%]">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {post.category.map((cat, idx) => (
                          <span key={idx} className="text-[11px] font-bold text-primary">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    
                    {/* 연도를 제외한 월.일(MM.DD)만 표시 */}
                    <time 
                      dateTime={post.date.replace(/\./g, "-")} 
                      className="text-[13px] font-medium text-muted-foreground/70 shrink-0 mt-2 sm:mt-0 font-mono"
                    >
                      {post.date.substring(5)}
                    </time>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      
    </div>
  );
}
