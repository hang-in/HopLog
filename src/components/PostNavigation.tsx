"use client";

import { useLocale } from "@/components/LocaleProvider";
import Link from "next/link";
import type { Post } from "@/lib/data";
import { getUIStrings } from "@/lib/i18n";

export default function PostNavigation({ prev, next }: { prev: Post | null; next: Post | null }) {
  const { locale } = useLocale();
  const ui = getUIStrings(locale);

  return (
    <nav className="mt-14 pt-7 border-t border-border/50 grid grid-cols-2 gap-3">
      {prev ? (
        <Link href={`/posts/${prev.id}`} className="group p-3.5 rounded-2xl hover:bg-muted/50 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">{ui.post.prev}</span>
          <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors mt-1 line-clamp-1">{prev.title}</p>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={`/posts/${next.id}`} className="group p-3.5 rounded-2xl hover:bg-muted/50 transition-colors text-right">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">{ui.post.next}</span>
          <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors mt-1 line-clamp-1">{next.title}</p>
        </Link>
      ) : <div />}
    </nav>
  );
}
