"use client";

import ErrorState from "@/components/ErrorState";
import { useLocale } from "@/components/LocaleProvider";
import { getUIStrings } from "@/lib/i18n";

export default function NotFoundState() {
  const { locale } = useLocale();
  const ui = getUIStrings(locale);

  return (
    <ErrorState kind="not-found">
      <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-primary/70">
          {ui.error.quoteHeading}
        </div>
        <blockquote className="space-y-3">
          <p className="text-[15px] font-semibold leading-relaxed text-foreground sm:text-[16px]">
            &ldquo;Programs must be written for people to read, and only incidentally for
            machines to execute.&rdquo;
          </p>
          <footer className="text-[12px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
            Harold Abelson
          </footer>
        </blockquote>
      </div>
    </ErrorState>
  );
}
