import { getPostById, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import TableOfContents from "@/components/TableOfContents";
import CodeCopyButton from "@/components/CodeCopyButton";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative w-full">
      {/* Table of Contents (데스크탑 와이드 전용) */}
      <TableOfContents />

      <article className="w-full py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-14 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-[13px] font-bold text-primary">
            <div className="flex gap-2">
              {post.category.map((cat, idx) => (
                <span key={idx}>{cat}</span>
              ))}
            </div>
            <span className="w-1 h-1 rounded-full bg-border shrink-0"></span>
            <time dateTime={post.date.replace(/\./g, "-")} className="text-muted-foreground font-medium shrink-0">
              {post.date}
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight 
                        prose-a:text-primary hover:prose-a:text-primary/80 
                        prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-sm
                        prose-pre:p-0 prose-pre:bg-transparent">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              // 코드 블록 커스터마이징
              pre: ({ children }) => {
                return (
                  <div className="relative group my-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-muted/40 shadow-sm">
                    <pre className="overflow-x-auto scrollbar-hide py-4 font-mono text-[13px] sm:text-[14px] leading-relaxed text-zinc-900 dark:text-zinc-100">
                      {/* 내부 code 태그에 직접 패딩 적용 */}
                      <div className="inline-block min-w-full px-8">
                        {children}
                      </div>
                    </pre>
                    {/* 복사 버튼 */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* @ts-ignore */}
                      <CodeCopyButton code={children?.props?.children || ""} />
                    </div>
                  </div>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
