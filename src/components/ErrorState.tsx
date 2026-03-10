"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { getUIStrings } from "@/lib/i18n";

export default function ErrorState({
  kind,
  retryAction,
  children,
}: {
  kind: "not-found" | "server-error";
  retryAction?: () => void;
  children?: React.ReactNode;
}) {
  const { locale } = useLocale();
  const ui = getUIStrings(locale);
  const isNotFound = kind === "not-found";

  const code = isNotFound ? ui.error.notFoundCode : ui.error.serverErrorCode;
  const title = isNotFound ? ui.error.notFoundTitle : ui.error.serverErrorTitle;
  const description = isNotFound
    ? ui.error.notFoundDescription
    : ui.error.serverErrorDescription;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-muted/30 px-5 py-12 sm:px-8 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.14),transparent_45%)]" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-start gap-5">
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
          {code}
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-[13px] font-bold text-background transition-colors hover:bg-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui.error.backHome}
          </Link>
          {retryAction && (
            <button
              type="button"
              onClick={retryAction}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" />
              {ui.error.retry}
            </button>
          )}
        </div>
        {children && (
          <div className="mt-6 w-full flex justify-center opacity-90 transition-opacity hover:opacity-100">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
