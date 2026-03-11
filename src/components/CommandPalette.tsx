"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useLocale } from "@/components/LocaleProvider";
import {
  Search, Moon, Sun, FileText, Home, User,
  Maximize, Minimize, Keyboard, X, Palette
} from "lucide-react";
import { useTheme } from "next-themes";
import { useBlogStore } from "@/store/useStore";
import { PostSearchItem } from "@/lib/data";
import { getUIStrings, LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n";
import { ColorTheme } from "@/lib/themes";

function normalizeSearchValue(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function isBoundaryCharacter(char: string | undefined): boolean {
  return !char || char === " " || char === "/" || char === "-" || char === "_";
}

function scoreFzfLikeMatch(value: string, search: string, keywords: string[] = []): number {
  const query = normalizeSearchValue(search);
  if (!query) {
    return 1;
  }

  const candidate = normalizeSearchValue([value, ...keywords].join(" "));
  if (!candidate) {
    return 0;
  }

  const substringIndex = candidate.indexOf(query);
  let score = 0;

  if (substringIndex !== -1) {
    score += 80 - Math.min(substringIndex, 40);
  }

  const positions: number[] = [];
  let cursor = 0;

  for (const char of query) {
    const index = candidate.indexOf(char, cursor);
    if (index === -1) {
      return substringIndex !== -1 ? score : 0;
    }
    positions.push(index);
    cursor = index + 1;
  }

  score += query.length * 4;

  for (let i = 0; i < positions.length; i += 1) {
    const current = positions[i];
    const previous = positions[i - 1];
    const previousChar = candidate[current - 1];

    if (i === 0 && isBoundaryCharacter(previousChar)) {
      score += 16;
    }

    if (isBoundaryCharacter(previousChar)) {
      score += 8;
    }

    if (i > 0) {
      const gap = current - previous - 1;
      if (gap === 0) {
        score += 14;
      } else {
        score += Math.max(0, 6 - gap);
      }
    }
  }

  if (positions[0] === 0) {
    score += 12;
  }

  score -= Math.min(candidate.length / 12, 10);

  return Math.max(score, 0);
}

export default function CommandPalette({ themes, faqEnabled }: { themes: ColorTheme[], faqEnabled: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [sequence, setSequence] = React.useState<string | null>(null);
  const [posts, setPosts] = React.useState<PostSearchItem[]>([]);
  const [postsLoaded, setPostsLoaded] = React.useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isWideMode, toggleWideMode, colorTheme, setColorTheme } = useBlogStore();
  const { locale, setLocale } = useLocale();
  const ui = getUIStrings(locale);

  React.useEffect(() => {
    if (!open || postsLoaded) {
      return;
    }

    let cancelled = false;

    fetch("/api/post-search")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load posts");
        }
        return res.json() as Promise<PostSearchItem[]>;
      })
      .then((items) => {
        if (!cancelled) {
          setPosts(items);
          setPostsLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPostsLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, postsLoaded]);

  React.useEffect(() => {
    if (sequence) {
      const timer = setTimeout(() => setSequence(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [sequence]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const isInput = document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key.toLowerCase() === "p")) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (e.key === "?" && e.shiftKey && !isInput) {
        e.preventDefault();
        setHelpOpen((prev) => !prev);
        return;
      }
      if (!isInput) {
        if (sequence === "g") {
          if (e.key.toLowerCase() === "h") { router.push("/"); setSequence(null); }
          if (e.key.toLowerCase() === "b") { router.push("/about"); setSequence(null); }
          if (faqEnabled && e.key.toLowerCase() === "f") { router.push("/faq"); setSequence(null); }
          return;
        }
        if (e.key.toLowerCase() === "g") {
          setSequence("g");
          return;
        }
        if (e.key.toLowerCase() === "t") {
          e.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
        }
        if (e.key.toLowerCase() === "w") {
          e.preventDefault();
          toggleWideMode();
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [faqEnabled, theme, setTheme, toggleWideMode, sequence, router]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const shortcuts = [
    { keys: ["⌘", "⇧", "P"], description: ui.command.commandPalette, category: ui.common.global },
    { keys: ["?"], description: ui.command.help, category: ui.common.global },
    { keys: ["T"], description: ui.command.toggleTheme, category: ui.common.system },
    { keys: ["W"], description: ui.command.toggleWideMode, category: ui.common.system },
    { keys: ["G", "H"], description: ui.command.goHome, category: ui.common.navigation },
    { keys: ["G", "B"], description: ui.command.goAbout, category: ui.common.navigation },
    ...(faqEnabled ? [{ keys: ["G", "F"], description: ui.command.goFaq, category: ui.common.navigation }] : []),
  ];

  const featuredPosts = React.useMemo(() => posts.slice(0, 6), [posts]);
  const postItems = React.useMemo(
    () => (search.trim() ? posts : featuredPosts),
    [featuredPosts, posts, search],
  );

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={ui.command.commandPalette}
        filter={scoreFzfLikeMatch}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
      >
        <div className="w-full max-w-[480px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[1.2rem] overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="flex items-center px-4 border-b border-black/[0.05] dark:border-white/10">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <Command.Input
              placeholder={ui.common.searchPlaceholder}
              value={search}
              onValueChange={setSearch}
              className="w-full h-12 px-2.5 bg-transparent outline-none text-[13px] font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto p-1.5 scrollbar-hide">
            <Command.Empty className="py-10 text-center text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">{ui.common.noResults}</Command.Empty>
            <Command.Group heading={ui.common.navigation} className="px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              <Command.Item value={ui.command.goHome} keywords={["home", "gh", "/"]} onSelect={() => runCommand(() => router.push("/"))} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3"><Home className="w-4 h-4" /> <span className="text-[13px] font-bold">{ui.command.goHome}</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">G H</kbd>
              </Command.Item>
              <Command.Item value={ui.command.about} keywords={["about", "gb", "/about"]} onSelect={() => runCommand(() => router.push("/about"))} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3"><User className="w-4 h-4" /> <span className="text-[13px] font-bold">{ui.command.about}</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">G B</kbd>
              </Command.Item>
              {faqEnabled && (
                <Command.Item value={ui.command.goFaq} keywords={["faq", "gf", "/faq"]} onSelect={() => runCommand(() => router.push("/faq"))} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                  <div className="flex items-center gap-3"><FileText className="w-4 h-4" /> <span className="text-[13px] font-bold">{ui.command.goFaq}</span></div>
                  <kbd className="text-[10px] opacity-50 font-mono">G F</kbd>
                </Command.Item>
              )}
            </Command.Group>

            <Command.Group heading={ui.common.posts} className="mt-1 border-t border-black/[0.03] dark:border-white/10 pt-3 px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {postItems.map((post) => (
                <Command.Item key={post.id} value={post.title} keywords={[post.id, ...post.category, post.excerpt]} onSelect={() => runCommand(() => router.push(`/posts/${post.id}`))} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                  <FileText className="w-4 h-4" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] font-bold">{post.title}</span>
                    <span className="truncate text-[11px] opacity-60 font-semibold">{post.category.join(", ")}</span>
                  </div>
                </Command.Item>
              ))}
              {open && !postsLoaded && postItems.length === 0 && (
                <div className="px-3 py-2 text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Loading posts...
                </div>
              )}
            </Command.Group>

            <Command.Group heading={ui.common.themes} className="mt-1 border-t border-black/[0.03] dark:border-white/10 pt-3 px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {themes?.map((themeOption) => (
                <Command.Item
                  key={themeOption.id}
                  value={` theme ${themeOption.name} ${themeOption.id}`}
                  onSelect={() => runCommand(() => setColorTheme(themeOption.id))}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4" />
                    <span className="text-[13px] font-bold">{themeOption.name}</span>
                  </div>
                  {colorTheme === themeOption.id && (
                    <span className="text-[10px] opacity-60 font-mono font-bold tracking-normal">{ui.common.active}</span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading={ui.common.system} className="mt-1 border-t border-black/[0.03] dark:border-white/10 pt-3 px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              <Command.Item onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))} className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3">{theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}<span className="text-[13px] font-bold">{ui.command.toggleTheme}</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">T</kbd>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => toggleWideMode())} className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3">{isWideMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}<span className="text-[13px] font-bold">{ui.command.toggleWideMode}</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">W</kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading={ui.common.languages} className="mt-1 border-t border-black/[0.03] dark:border-white/10 pt-3 px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {SUPPORTED_LOCALES.map((localeOption) => (
                <Command.Item key={localeOption} onSelect={() => runCommand(() => setLocale(localeOption))} className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                  <div className="flex items-center gap-3"><span className="w-4 text-center text-[11px] font-black">{localeOption.toUpperCase()}</span><span className="text-[13px] font-bold">{LOCALE_LABELS[localeOption]}</span></div>
                  {locale === localeOption && <span className="text-[10px] opacity-60 font-mono font-bold tracking-normal">{ui.common.active}</span>}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.05] dark:border-white/10 flex items-center justify-between text-[9px] text-zinc-500 dark:text-zinc-400 px-5 font-bold uppercase tracking-widest">
            <div className="flex gap-4"><span>↑↓ {ui.common.navigate}</span><span>↵ {ui.common.select}</span></div>
            <span>ESC {ui.common.close}</span>
          </div>
        </div>
      </Command.Dialog>

      {helpOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/20 dark:bg-black/50 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-[380px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] rounded-[2rem] p-8 relative animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setHelpOpen(false)} className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-zinc-500" /></button>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl"><Keyboard className="w-5 h-5 text-primary" /></div>
              <div><h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{ui.common.keyboardShortcuts}</h2><p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-semibold">{ui.common.commandSystem}</p></div>
            </div>
            <div className="space-y-6">
              {[ui.common.global, ui.common.navigation, ui.common.system].map((cat) => (
                <div key={cat} className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{cat}</h3>
                  <div className="space-y-2.5">
                    {shortcuts.filter((shortcut) => shortcut.category === cat).map((shortcut) => (
                      <div key={`${cat}-${shortcut.description}`} className="flex items-center justify-between group">
                        <span className="text-[14px] font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">{shortcut.description}</span>
                        <div className="flex gap-1">
                          {shortcut.keys.map((keyValue) => (
                            <kbd key={`${shortcut.description}-${keyValue}`} className="px-2 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded text-[10px] font-mono font-black text-zinc-800 dark:text-zinc-200 shadow-sm min-w-[24px] text-center">{keyValue}</kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
