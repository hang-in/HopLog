"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Maximize, Minimize, Command as CommandIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBlogStore } from "@/store/useStore";

export default function Header({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();
  const { isWideMode, toggleWideMode } = useBlogStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // 상태에 따라 data-wide 속성 관리 (기본이 Wide이므로 false일 때만 narrow 처리)
    if (isWideMode) {
      document.documentElement.removeAttribute('data-wide');
    } else {
      document.documentElement.setAttribute('data-wide', 'false');
    }
  }, [isWideMode]);

  const toggleTheme = (event: React.MouseEvent) => {
    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className={cn(
        "mx-auto flex h-16 items-center justify-between px-6 max-w-5xl narrow:max-w-2xl",
        mounted && "transition-all duration-500 ease-in-out"
      )}>
        <Link
          href="/"
          className="group flex items-center gap-1 active:scale-95 transition-transform"
          aria-label="Home (G H)"
          title="G H"
        >
          <span className="font-bold tracking-tight text-xl text-foreground">
            {title}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary mb-1 inline-block"></span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden sm:flex gap-6 text-[13px] font-medium text-muted-foreground mr-2">
            <Link href="/archive" className="hover:text-foreground transition-colors group relative" title="G A">
              아카이브
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[9px] font-mono font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">G A</span>
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors group relative" title="G B">
              소개
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[9px] font-mono font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">G B</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {/* Command Palette Hint (Always visible on hover) */}

            <button
              onClick={toggleWideMode}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hidden md:block group relative"
              aria-label="Toggle wide mode (W)"
            >
              {!mounted ? (
                <div className="w-4 h-4" />
              ) : isWideMode ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[9px] font-mono font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">W</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group relative"
              aria-label="Toggle theme (T)"
            >
              {!mounted ? (
                <div className="w-4 h-4" />
              ) : theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[9px] font-mono font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">T</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
