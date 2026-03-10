"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    // 본문에서 h1, h2, h3 태그들을 추출
    const elements = Array.from(document.querySelectorAll("h1, h2, h3"))
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: Number(el.tagName.replace("H", "")),
      }));
    setToc(elements);

    // 스크롤 감지를 위한 Intersection Observer 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    document.querySelectorAll("h1, h2, h3").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (toc.length === 0) return null;

  return (
    <aside className="hidden xl:block fixed left-[calc(50%+30rem)] top-32 w-64 max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-hide">
      <nav className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 px-4">
          On this page
        </h3>
        <ul className="space-y-2 border-l border-border/50 ml-4 py-1">
          {toc.map((item) => (
            <li
              key={item.id}
              className={cn(
                "transition-all duration-300",
                item.level === 1 && "ml-0",
                item.level === 2 && "ml-4",
                item.level === 3 && "ml-8"
              )}
            >
              <a
                href={`#${item.id}`}
                className={cn(
                  "block text-[13px] font-medium py-1 px-4 -ml-px border-l transition-colors hover:text-primary",
                  activeId === item.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
