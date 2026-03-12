"use client";

import { useLocale } from "@/components/LocaleProvider";
import { getUIStrings } from "@/lib/i18n";

export default function Footer({
  email,
  social,
}: {
  email: string;
  social: { platform: string; url: string }[];
}) {
  const { locale } = useLocale();
  const ui = getUIStrings(locale);

  return (
    <footer className="w-full px-5 py-6 border-t border-border mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[12px] text-muted-foreground font-medium">
          © 2026 {email}. {ui.footer.allRightsReserved}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {social.map((link) => (
            <a
              key={`${link.platform}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary text-[11px] font-bold rounded-full transition-all duration-200 border border-border/50 hover:border-primary/30"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
