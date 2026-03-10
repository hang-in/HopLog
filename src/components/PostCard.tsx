"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/data";

interface PostCardProps {
    post: Post;
    variant?: "compact" | "default";
}

export default function PostCard({ post, variant = "default" }: PostCardProps) {
    const isCompact = variant === "compact";

    return (
        <article className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
            <Link
                href={`/posts/${post.id}`}
                className={cn(
                    "group relative block transition-all duration-500 active:scale-[0.98] overflow-hidden border border-transparent hover:border-white/5 hover:shadow-2xl",
                    isCompact ? "p-4 rounded-2xl" : "p-5 sm:p-6 rounded-3xl -mx-5 sm:-mx-6",
                    post.image
                        ? "hover:bg-muted/40 hover:backdrop-blur-2xl"
                        : "hover:bg-muted/50"
                )}
            >
                {post.image && (
                    <div
                        className="absolute inset-0 -z-10 opacity-0 blur-3xl saturate-150 group-hover:opacity-[0.12] transition-opacity duration-700 scale-125 pointer-events-none"
                        style={{
                            backgroundImage: `url(${post.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                )}

                <div className={cn(
                    "flex gap-4",
                    isCompact ? "flex-row items-center" : "flex-col sm:flex-row sm:gap-6 sm:items-center"
                )}>
                    <div className="flex-1 space-y-2">
                        {!isCompact && (
                            <div className="flex flex-wrap gap-1.5 mb-1">
                                {post.category.map((cat, idx) => (
                                    <span key={idx} className="text-[12px] font-bold text-primary">
                                        {cat}
                                        {idx < post.category.length - 1 ? (
                                            <span className="text-muted-foreground ml-1.5">•</span>
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}

                        {isCompact && (
                            <div className="flex flex-wrap gap-1.5 mb-0.5">
                                {post.category.map((cat, idx) => (
                                    <span key={idx} className="text-[11px] font-bold text-primary">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h3 className={cn(
                            "font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200",
                            isCompact ? "text-[16px] sm:text-[17px]" : "text-xl"
                        )}>
                            {post.title}
                        </h3>

                        {!isCompact && (
                            <p className="text-[15px] text-muted-foreground/90 line-clamp-2 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        <time
                            dateTime={post.date.replace(/\./g, "-")}
                            className={cn(
                                "inline-block font-medium text-muted-foreground/60 shrink-0 font-mono",
                                isCompact ? "text-[12px]" : "text-[13px]"
                            )}
                        >
                            {isCompact ? post.date.substring(5) : post.date}
                        </time>
                    </div>

                    {post.image && (
                        <div className={cn(
                            "relative shrink-0 rounded-2xl overflow-hidden border border-border/50 shadow-2xl group-hover:border-primary/30 transition-all duration-500",
                            isCompact ? "w-16 h-16 sm:w-20 sm:h-20" : "w-full sm:w-28 lg:w-32 aspect-square"
                        )}>
                            <img
                                src={post.image}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt={post.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
}
