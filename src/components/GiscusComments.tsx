"use client";

import { useSyncExternalStore } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useBlogStore } from "@/store/useStore";

const LOCALE_TO_GISCUS_LANG: Record<string, string> = {
  zh: "zh-CN",
};

interface GiscusCommentsProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  strict: boolean;
  reactionsEnabled: boolean;
  inputPosition: "top" | "bottom";
  lang: string;
}

export default function GiscusComments(props: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();
  const { colorTheme, locale } = useBlogStore();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const themeUrl = `${window.location.origin}/api/giscus-theme?theme=${colorTheme}&mode=${mode}`;
  const giscusLang = props.lang || LOCALE_TO_GISCUS_LANG[locale] || locale || "en";

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <Giscus
        id="giscus-comments"
        repo={props.repo as `${string}/${string}`}
        repoId={props.repoId}
        category={props.category}
        categoryId={props.categoryId}
        mapping={props.mapping}
        strict={props.strict ? "1" : "0"}
        reactionsEnabled={props.reactionsEnabled ? "1" : "0"}
        emitMetadata="0"
        inputPosition={props.inputPosition}
        theme={themeUrl}
        lang={giscusLang}
        loading="lazy"
      />
    </div>
  );
}
