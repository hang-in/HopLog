"use client";

import { useLocale } from "@/components/LocaleProvider";
import { getUIStrings } from "@/lib/i18n";
import { useBlogStore } from "@/store/useStore";
import { Post } from "@/lib/data";
import { ChevronDown } from "lucide-react";
import PostCard from "@/components/PostCard";

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const { selectedCategory, setCategory, visibleCount, loadMore } = useBlogStore();
  const { locale } = useLocale();
  const ui = getUIStrings(locale);

  const filteredPosts = selectedCategory
    ? initialPosts.filter(p => p.category.includes(selectedCategory))
    : initialPosts;

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const categories = Array.from(new Set(initialPosts.flatMap((p) => p.category)));

  return (
    <section className="space-y-6">
      {/* Category Filter (Select Box) */}
      <div className="flex justify-between items-center pb-2 border-b border-border/50">
        <h2 className="text-[13px] font-bold text-foreground">
          {ui.postList.latestPosts} <span className="text-muted-foreground font-normal ml-1">{filteredPosts.length}</span>
        </h2>

        <div className="relative">
          <select
            value={selectedCategory || ""}
            onChange={(e) => setCategory(e.target.value === "" ? null : e.target.value)}
            className="appearance-none bg-muted/50 hover:bg-muted text-[13px] font-semibold text-foreground pl-4 pr-10 py-2 rounded-full outline-none transition-colors cursor-pointer focus:ring-2 focus:ring-primary/50"
          >
            <option value="">{ui.postList.allCategories}</option>
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
      <div className="flex flex-col gap-3">
        {displayedPosts.length === 0 ? (
          <div className="py-14 text-center text-sm text-muted-foreground font-medium bg-muted/30 rounded-2xl">
            {ui.postList.noPostsInCategory}
          </div>
        ) : (
          displayedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-3 pb-1 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="px-5 py-2.5 rounded-full bg-muted/50 text-[14px] font-semibold text-foreground hover:bg-muted transition-all active:scale-95 flex items-center gap-2"
          >
            <span>{ui.postList.loadMore}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

    </section>
  );
}
