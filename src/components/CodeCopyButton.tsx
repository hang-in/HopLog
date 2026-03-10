"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { getUIStrings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const { locale } = useLocale();
  const ui = getUIStrings(locale);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "absolute right-3 top-3 p-2 rounded-lg transition-all active:scale-95 z-20",
        "bg-white/10 hover:bg-white/20 border border-white/10 text-white/50 hover:text-white"
      )}
      aria-label={ui.copy.copyCode}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
