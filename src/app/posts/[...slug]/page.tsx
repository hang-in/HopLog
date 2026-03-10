import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isValidElement } from "react";
import { getPostById, getAllPosts, getAdjacentPosts } from "@/lib/posts";
import { getConfig } from "@/lib/config";
import { getUIStrings, parseLocaleCookie } from "@/lib/i18n";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import TableOfContents from "@/components/TableOfContents";
import CodeCopyButton from "@/components/CodeCopyButton";
import PostNavigation from "@/components/PostNavigation";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.id.split("/"),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostById(slug.join("/"));

  if (!post) {
    const locale = parseLocaleCookie((await cookies()).get("hoplog-locale")?.value);
    return {
      title: getUIStrings(locale).error.notFoundTitle,
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const id = slug.join("/");
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(id);
  const config = getConfig();
  const lineHeight = config.typography?.lineHeight ?? 1.75;
  const fontFamily = post.fontFamily || config.typography?.fontFamily || undefined;
  const fontUrl = post.fontUrl || config.typography?.fontUrl || undefined;
  const getCodeText = (node: unknown): string => {
    if (typeof node === "string") {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(getCodeText).join("");
    }

    if (isValidElement<{ children?: unknown }>(node)) {
      return getCodeText(node.props.children);
    }

    return "";
  };

  return (
    <div className="relative w-full">
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}
      <TableOfContents />

      <article className="w-full py-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-10 space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-[13px] font-bold text-primary">
            <div className="flex gap-2">
              {post.category.map((cat) => (
                <span key={`${post.id}-${cat}`}>{cat}</span>
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

        <div
          className="prose prose-zinc dark:prose-invert max-w-none 
                     prose-headings:font-bold prose-headings:tracking-tight 
                     prose-a:text-primary hover:prose-a:text-primary/80 
                     prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-sm
                     prose-pre:p-0 prose-pre:bg-transparent"
          style={{ lineHeight, fontFamily }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              pre: ({ children }) => {
                return (
                    <div className="relative group my-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-muted/40 shadow-sm">
                    <pre className="overflow-x-auto scrollbar-hide py-4 font-mono text-[13px] sm:text-[14px] leading-relaxed text-zinc-900 dark:text-zinc-100">
                      <div className="inline-block min-w-full px-8">
                        {children}
                      </div>
                    </pre>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <CodeCopyButton code={getCodeText(children)} />
                    </div>
                  </div>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <PostNavigation prev={prev} next={next} />
      </article>
    </div>
  );
}
