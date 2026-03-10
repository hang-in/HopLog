"use client";

import Link from "next/link";
import { useBlogStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/data";
import { ChevronDown } from "lucide-react";

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const { selectedCategory, setCategory, visibleCount, loadMore } = useBlogStore();
  
  // 카테고리 필터링
  const filteredPosts = selectedCategory 
    ? initialPosts.filter(p => p.category.includes(selectedCategory)) 
    : initialPosts;

  // 화면에 그릴 포스트 갯수 자르기 (Pagination)
  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const categories = Array.from(new Set(initialPosts.flatMap((p) => p.category)));

  return (
    <section className="space-y-8">
      {/* Category Filter (Select Box) */}
      <div className="flex justify-between items-center pb-2 border-b border-border/50">
        <h2 className="text-[13px] font-bold text-foreground">
          최신 글 <span className="text-muted-foreground font-normal ml-1">{filteredPosts.length}</span>
        </h2>
        
        <div className="relative">
          <select
            value={selectedCategory || ""}
            onChange={(e) => setCategory(e.target.value === "" ? null : e.target.value)}
            className="appearance-none bg-muted/50 hover:bg-muted text-[13px] font-semibold text-foreground pl-4 pr-10 py-2 rounded-full outline-none transition-colors cursor-pointer focus:ring-2 focus:ring-primary/50"
          >
            <option value="">전체 카테고리</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Post List */}
      <div className="flex flex-col gap-4">
        {displayedPosts.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground font-medium bg-muted/30 rounded-2xl">
            해당 카테고리에 글이 없습니다.
          </div>
        ) : (
          displayedPosts.map((post) => (
            <article key={post.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
              <Link 
                href={`/posts/${post.id}`} 
                className="group block p-5 sm:p-6 -mx-5 sm:-mx-6 rounded-2xl hover:bg-muted/50 transition-colors duration-300 active:scale-[0.99]"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {post.category.map((cat, idx) => (
                        <span key={idx} className="text-[12px] font-bold text-primary">
                          {cat}{idx < post.category.length - 1 ? <span className="text-muted-foreground ml-1.5">•</span> : ""}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-[15px] text-muted-foreground line-clamp-2 leading-relaxed mt-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <time 
                    dateTime={post.date.replace(/\./g, "-")} 
                    className="text-[13px] font-medium text-muted-foreground/70 shrink-0 mt-2 sm:mt-0 font-mono"
                  >
                    {post.date}
                  </time>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-6 pb-2 flex justify-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 rounded-full bg-muted/50 text-[14px] font-semibold text-foreground hover:bg-muted transition-all active:scale-95 flex items-center gap-2"
          >
            <span>더 보기</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* View All Archive Link */}
      {!hasMore && displayedPosts.length > 0 && (
        <div className="pt-6 text-center">
          <Link 
            href="/archive"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <span>모든 아카이브 보기</span>
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
