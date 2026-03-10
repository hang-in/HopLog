"use client";

import * as React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/data";
import { useTheme } from "next-themes";

// ── Dynamic Color Scheme Mapping ────────────────────────────────
const JOURNAL_COLORS = [
  "var(--activity-0)",
  "var(--activity-1)",
  "var(--activity-2)",
  "var(--activity-3)",
  "var(--activity-4)",
];

const GITHUB_THEME: { light: string[]; dark: string[] } = {
  light: JOURNAL_COLORS,
  dark: JOURNAL_COLORS,
};

// ── Tooltip: ref-based DOM manipulation (zero re-renders) ───────
interface TooltipHandle {
  show: (x: number, y: number, content: string) => void;
  hide: () => void;
}

const Tooltip = React.forwardRef<TooltipHandle>((_, ref) => {
  const elRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  React.useImperativeHandle(ref, () => ({
    show(x: number, y: number, content: string) {
      if (elRef.current) {
        elRef.current.style.left = `${x}px`;
        elRef.current.style.top = `${y}px`;
        elRef.current.style.opacity = "1";
      }
      if (textRef.current) textRef.current.textContent = content;
    },
    hide() {
      if (elRef.current) elRef.current.style.opacity = "0";
    },
  }));

  return (
    <div
      ref={elRef}
      className="fixed z-[9999] pointer-events-none px-3 py-1.5 bg-zinc-900/90 dark:bg-zinc-100/90 text-zinc-100 dark:text-zinc-900 text-[11px] font-bold rounded-lg shadow-xl backdrop-blur-md -translate-x-1/2 -translate-y-full mt-[-10px] transition-opacity duration-150"
      style={{ opacity: 0 }}
    >
      <span ref={textRef} />
      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900/90 dark:bg-zinc-100/90 rotate-45" />
    </div>
  );
});
Tooltip.displayName = "Tooltip";

// ── JournalGrid: memo'd to prevent re-renders from parent ───────
const JournalGrid = React.memo(function JournalGrid({
  blogPosts,
  onHover,
  onLeave,
}: {
  blogPosts: Post[];
  onHover: (e: React.MouseEvent, content: string) => void;
  onLeave: () => void;
}) {
  const gridDates = React.useMemo(() => {
    const dates = [];
    const now = new Date();
    const lastDate = new Date(now);
    const dayOfWeek = now.getDay();
    lastDate.setDate(now.getDate() + (6 - dayOfWeek));

    for (let i = 370; i >= 0; i--) {
      const d = new Date(lastDate);
      d.setDate(lastDate.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dates.push(key);
    }
    return dates;
  }, []);

  const journalMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    blogPosts?.forEach((post) => {
      const dateKey = post.date.replace(/\./g, "-");
      map[dateKey] = Math.min((map[dateKey] || 0) + 2, 4);
    });
    return map;
  }, [blogPosts]);

  const weeks = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < gridDates.length; i += 7) {
      result.push(gridDates.slice(i, i + 7));
    }
    return result;
  }, [gridDates]);

  return (
    <div className="space-y-3 w-full animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          Journal Activity
        </h3>
      </div>
      <div className="flex w-full justify-between gap-[1px] sm:gap-[2px] select-none h-auto px-0.5">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="flex flex-col gap-[1px] sm:gap-[2px] flex-1"
          >
            {week.map((date) => (
              <div
                key={date}
                className="aspect-square w-full rounded-[0.5px] sm:rounded-[1px] transition-colors cursor-crosshair hover:ring-1 hover:ring-primary/50"
                style={{
                  backgroundColor: JOURNAL_COLORS[journalMap[date] || 0],
                }}
                onMouseEnter={(e) =>
                  onHover(e, `${date}: ${journalMap[date] || 0} posts`)
                }
                onMouseLeave={onLeave}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-1">
        <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-tighter italic">
          Writing Density
        </p>
        <div className="flex gap-[2px]">
          {JOURNAL_COLORS.map((c, i) => (
            <div
              key={i}
              className="w-[6px] h-[6px] rounded-[1px]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// ── GitHubSection: memo'd separately ────────────────────────────
const GitHubSection = React.memo(function GitHubSection({
  username,
  colorScheme,
  onHover,
  onLeave,
}: {
  username: string;
  colorScheme: "dark" | "light";
  onHover: (e: React.MouseEvent, content: string) => void;
  onLeave: () => void;
}) {
  const renderBlock = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (block: any, activity: { date: string; count: number }) =>
      React.cloneElement(block, {
        onMouseEnter: (e: React.MouseEvent) =>
          onHover(e, `${activity.date}: ${activity.count} contributions`),
        onMouseLeave: onLeave,
        className: "cursor-crosshair",
      }),
    [onHover, onLeave]
  );

  const themeColors = GITHUB_THEME[colorScheme];

  return (
    <div className="space-y-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 delay-50">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          GitHub Contribution
        </h3>
        <span className="text-[9px] font-mono font-bold">
          @{username}
        </span>
      </div>

      <div className="github-calendar-wrapper w-full">
        <GitHubCalendar
          {...({
            username,
            theme: GITHUB_THEME,
            colorScheme,
            blockSize: 16.5,
            blockMargin: 2,
            fontSize: 12,
            hideColorLegend: true,
            hideTotalCount: true,
            renderBlock,
          } as any)}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-tighter text-right italic">
          Code Intensity
        </p>
        <div className="flex gap-[2px]">
          {themeColors.map((c, i) => (
            <div
              key={i}
              className="w-[6px] h-[6px] rounded-[1px]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// ── Main Component ──────────────────────────────────────────────
export default function ActivityGrid({
  githubUsername,
  blogPosts,
}: {
  githubUsername?: string;
  blogPosts: Post[];
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [showGitHub, setShowGitHub] = React.useState(false);
  const tooltipRef = React.useRef<TooltipHandle>(null);

  React.useEffect(() => {
    setMounted(true);
    if (
      !githubUsername ||
      githubUsername === "facebook" ||
      githubUsername === ""
    ) {
      setShowGitHub(false);
      return;
    }

    fetch(
      `https://github-contributions-api.deno.dev/${githubUsername}.json`
    )
      .then((res) => {
        setShowGitHub(res.ok);
      })
      .catch(() => setShowGitHub(false));
  }, [githubUsername]);

  // Stable callback refs — never change, so memo'd children never re-render
  const handleHover = React.useCallback(
    (e: React.MouseEvent, content: string) => {
      tooltipRef.current?.show(e.clientX, e.clientY, content);
    },
    []
  );

  const hideTooltip = React.useCallback(() => {
    tooltipRef.current?.hide();
  }, []);

  const colorScheme: "dark" | "light" =
    theme === "dark" ? "dark" : "light";

  if (!mounted) return null;

  return (
    <section
      className="py-16 border-t border-border/50 space-y-8 w-full overflow-hidden"
      onMouseLeave={hideTooltip}
    >
      <Tooltip ref={tooltipRef} />

      <JournalGrid
        blogPosts={blogPosts}
        onHover={handleHover}
        onLeave={hideTooltip}
      />

      {showGitHub && (
        <GitHubSection
          username={githubUsername!}
          colorScheme={colorScheme}
          onHover={handleHover}
          onLeave={hideTooltip}
        />
      )}

      <style jsx global>{`
        .github-calendar-wrapper > div {
          width: 100% !important;
          max-width: none !important;
        }
        .github-calendar-wrapper svg {
          width: 100% !important;
          height: auto !important;
          display: block !important;
          overflow: visible;
        }
        .github-calendar-wrapper rect {
          transition: opacity 0.2s;
        }
        .github-calendar-wrapper rect:hover {
          opacity: 0.6;
        }
        .github-calendar-wrapper footer {
          display: none !important;
        }
      `}</style>
    </section>
  );
}
