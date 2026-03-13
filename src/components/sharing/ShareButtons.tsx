"use client";

import * as React from "react";
import { Check } from "lucide-react";
import type { SharingProvider } from "@/lib/config";
import { useLocale } from "@/components/LocaleProvider";
import { getUIStrings } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { resolveProviders } from "./providers";
import type { ShareContext } from "./types";

interface ShareButtonsProps {
  providers: SharingProvider[];
  title: string;
  description?: string;
}

export default function ShareButtons({ providers: providerKeys, title, description }: ShareButtonsProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const { locale } = useLocale();
  const ui = getUIStrings(locale);
  const providers = React.useMemo(() => resolveProviders(providerKeys), [providerKeys]);

  if (providers.length === 0) return null;

  const handleShare = (provider: (typeof providers)[number]) => {
    const context: ShareContext = { url: window.location.href, title, description };
    const needsCopy = provider.meta.key === "copyLink";
    provider.share(context);

    if (needsCopy) {
      setCopiedKey(provider.meta.key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6 mb-2 pt-5 border-t border-border/50">
      <div className="flex w-full max-w-xs items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          {ui.sharing.title}
        </h2>
        <span aria-live="polite" className="min-h-[1rem] text-xs font-medium text-muted-foreground">
          {copiedKey ? ui.sharing.copied : ""}
        </span>
      </div>
      <div className="flex items-center gap-2" role="group" aria-label={ui.sharing.title}>
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isCopied = copiedKey === provider.meta.key;

          return (
            <button
              key={provider.meta.key}
              type="button"
              onClick={() => handleShare(provider)}
              className={cn(
                "p-2.5 rounded-xl transition-all active:scale-95",
                "text-muted-foreground hover:text-foreground",
                "bg-muted/50 hover:bg-muted border border-border/50 hover:border-border",
              )}
              aria-label={provider.meta.ariaLabel}
              title={provider.meta.label}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
