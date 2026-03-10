"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Maximize, Minimize } from "lucide-react";
import { getUIStrings, LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";
import { cn } from "@/lib/utils";
import { useBlogStore } from "@/store/useStore";

export default function Header({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();
  const { isWideMode, toggleWideMode } = useBlogStore();
  const { locale, setLocale } = useLocale();
  const [mounted, setMounted] = React.useState(false);
  const ui = getUIStrings(locale);

  React.useEffect(() => {
    setMounted(true);
    if (isWideMode) {
      document.documentElement.removeAttribute('data-wide');
    } else {
      document.documentElement.setAttribute('data-wide', 'false');
    }
  }, [isWideMode]);

  const toggleTheme = () => {
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
        "mx-auto flex h-14 items-center justify-between px-5 max-w-5xl narrow:max-w-2xl",
        mounted && "transition-all duration-500 ease-in-out"
      )}>
        <Link
          href="/"
          className="group flex items-center gap-1 active:scale-95 transition-transform"
          aria-label={ui.header.homeAria}
          title="G H"
        >
          <span className="font-bold tracking-tight text-xl text-foreground">
            {title}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary mb-1 inline-block"></span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden sm:flex gap-5 text-[13px] font-medium text-muted-foreground mr-1">
            <Link href="/about" className="hover:text-foreground transition-colors group relative" title="G B">
              {ui.header.about}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[9px] font-mono font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">G B</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <label className="sr-only" htmlFor="locale-select">{ui.header.languageSelector}</label>
            <select
              id="locale-select"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              aria-label={ui.header.languageSelector}
              className="appearance-none bg-transparent text-[11px] font-bold text-center text-muted-foreground hover:text-foreground px-3 py-1 rounded-full border border-border/60 hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              style={{ textAlignLast: 'center' }}
            >
              {SUPPORTED_LOCALES.map((localeOption) => (
                <option key={localeOption} value={localeOption}>
                  {LOCALE_LABELS[localeOption]}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={toggleWideMode}
              className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hidden md:block group relative"
              aria-label={ui.header.toggleWideMode}
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
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group relative"
              aria-label={ui.header.toggleTheme}
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
