"use client";

import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import type { FAQCatalog } from "@/lib/faq";
import { DEFAULT_LOCALE, getUIStrings, isLocale } from "@/lib/i18n";

export default function FAQContent({ catalog }: { catalog: FAQCatalog }) {
  const { locale } = useLocale();
  const faq = isLocale(locale) && catalog[locale] ? catalog[locale] : catalog[DEFAULT_LOCALE] ?? null;
  const ui = getUIStrings(locale);

  if (!faq) {
    return (
      <section className="rounded-[2rem] border border-border/50 bg-muted/30 px-5 py-12 sm:px-8 sm:py-14">
        <p className="text-[15px] font-medium text-muted-foreground">{ui.faq.empty}</p>
      </section>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-primary">
          {faq.title}
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{faq.title}</h1>
          <p className="max-w-2xl text-[16px] leading-relaxed text-muted-foreground">{faq.description}</p>
        </div>
      </section>

      <div className="space-y-8">
        {faq.groups.map((group) => (
          <section key={group.id} className="space-y-4">
            <h2 className="border-b border-border pb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              {group.title}
            </h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <details key={item.id} className="group rounded-2xl border border-border/60 bg-background/60 px-5 py-4 shadow-sm transition-colors open:bg-muted/20">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-foreground marker:hidden">
                    <span>{item.question}</span>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="pt-3 text-[14px] leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
