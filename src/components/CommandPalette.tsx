"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search, Moon, Sun, FileText, Home, Archive, User,
  Maximize, Minimize, Command as CommandIcon, Keyboard, X, Palette
} from "lucide-react";
import { useTheme } from "next-themes";
import { useBlogStore } from "@/store/useStore";
import { Post } from "@/lib/data";
import { ColorSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export default function CommandPalette({ posts, schemas }: { posts: Post[], schemas: ColorSchema[] }) {
  const [open, setOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [sequence, setSequence] = React.useState<string | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isWideMode, toggleWideMode, colorSchema, setColorSchema } = useBlogStore();

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
          if (e.key.toLowerCase() === "a") { router.push("/archive"); setSequence(null); }
          if (e.key.toLowerCase() === "b") { router.push("/about"); setSequence(null); }
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
  }, [theme, setTheme, toggleWideMode, sequence, router]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const shortcuts = [
    { keys: ["⌘", "⇧", "P"], description: "Command Palette", category: "Global" },
    { keys: ["?"], description: "Help", category: "Global" },
    { keys: ["T"], description: "Toggle Theme", category: "System" },
    { keys: ["W"], description: "Toggle Wide Mode", category: "System" },
    { keys: ["G", "H"], description: "Go Home", category: "Navigation" },
    { keys: ["G", "A"], description: "Go Archive", category: "Navigation" },
    { keys: ["G", "B"], description: "Go About", category: "Navigation" },
  ];

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command Palette"
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
      >
        <div className="w-full max-w-[480px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[1.2rem] overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="flex items-center px-4 border-b border-black/[0.05] dark:border-white/10">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <Command.Input
              placeholder="Search commands or posts..."
              className="w-full h-12 px-2.5 bg-transparent outline-none text-[13px] font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto p-1.5 scrollbar-hide">
            <Command.Empty className="py-10 text-center text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">No results found.</Command.Empty>
            <Command.Group heading="Navigation" className="px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              <Command.Item onSelect={() => runCommand(() => router.push("/"))} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3"><Home className="w-4 h-4" /> <span className="text-[13px] font-bold">Go Home</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">G H</kbd>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push("/archive"))} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3"><Archive className="w-4 h-4" /> <span className="text-[13px] font-bold">Archive</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">G A</kbd>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push("/about"))} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3"><User className="w-4 h-4" /> <span className="text-[13px] font-bold">About</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">G B</kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Themes" className="mt-1 border-t border-black/[0.03] dark:border-white/10 pt-3 px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {schemas?.map((s) => (
                <Command.Item
                  key={s.id}
                  value={` theme ${s.name} ${s.id}`}
                  onSelect={() => runCommand(() => setColorSchema(s.id))}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4" />
                    <span className="text-[13px] font-bold">{s.name} Theme</span>
                  </div>
                  {colorSchema === s.id && (
                    <span className="text-[10px] opacity-60 font-mono font-bold tracking-normal">Active</span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="System" className="mt-1 border-t border-black/[0.03] dark:border-white/10 pt-3 px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              <Command.Item onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3">{theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}<span className="text-[13px] font-bold">Toggle Theme</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">T</kbd>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => toggleWideMode())} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                <div className="flex items-center gap-3">{isWideMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}<span className="text-[13px] font-bold">Toggle Wide Mode</span></div>
                <kbd className="text-[10px] opacity-50 font-mono">W</kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Posts" className="mt-1 border-t border-black/[0.03] dark:border-white/10 pt-3 px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {posts.map((post) => (
                <Command.Item key={post.id} onSelect={() => runCommand(() => router.push(`/posts/${post.id}`))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all duration-150">
                  <FileText className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold">{post.title}</span>
                    <span className="text-[11px] opacity-60 font-semibold">{post.category.join(", ")}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.05] dark:border-white/10 flex items-center justify-between text-[9px] text-zinc-500 dark:text-zinc-400 px-5 font-bold uppercase tracking-widest">
            <div className="flex gap-4"><span>↑↓ Navigate</span><span>↵ Select</span></div>
            <span>ESC to Close</span>
          </div>
        </div>
      </Command.Dialog>

      {helpOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/20 dark:bg-black/50 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-[380px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] rounded-[2rem] p-8 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setHelpOpen(false)} className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-zinc-500" /></button>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl"><Keyboard className="w-5 h-5 text-primary" /></div>
              <div><h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Keyboards</h2><p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-semibold">HopLog Command System</p></div>
            </div>
            <div className="space-y-6">
              {["Global", "System", "Navigation"].map((cat) => (
                <div key={cat} className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{cat}</h3>
                  <div className="space-y-2.5">
                    {shortcuts.filter(s => s.category === cat).map((s, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="text-[14px] font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">{s.description}</span>
                        <div className="flex gap-1">
                          {s.keys.map((k, ki) => (
                            <kbd key={ki} className="px-2 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded text-[10px] font-mono font-black text-zinc-800 dark:text-zinc-200 shadow-sm min-w-[24px] text-center">{k}</kbd>
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
