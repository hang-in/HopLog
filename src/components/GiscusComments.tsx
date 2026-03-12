"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
  const [giscusTheme, setGiscusTheme] = useState<`data:${string}` | "light" | "dark" | null>(null);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const giscusLang = props.lang || LOCALE_TO_GISCUS_LANG[locale] || locale || "en";

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        const response = await fetch(`/api/giscus-theme?theme=${colorTheme}&mode=${mode}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load Giscus theme: ${response.status}`);
        }

        const css = await response.text();
        const themeDataUrl = `data:text/css;charset=utf-8,${encodeURIComponent(css)}` as const;
        setGiscusTheme(themeDataUrl);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setGiscusTheme(mode);
      }
    })();

    return () => controller.abort();
  }, [colorTheme, mode, mounted]);

  if (!mounted || !giscusTheme) return null;

  return (
    <div className="pt-4">
      <Giscus
        key={`${colorTheme}-${mode}`}
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
        theme={giscusTheme}
        lang={giscusLang}
        loading="lazy"
      />
    </div>
  );
}
