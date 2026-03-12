import type { ShareContext, ShareProviderMeta } from "../types";
import { ShareProvider } from "../types";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export class TwitterProvider extends ShareProvider {
  readonly meta: ShareProviderMeta = {
    key: "twitter",
    label: "Twitter",
    ariaLabel: "Share on Twitter",
  };

  icon = TwitterIcon;

  share({ url, title }: ShareContext): void {
    const params = new URLSearchParams({ text: title, url });
    window.open(`https://twitter.com/intent/tweet?${params}`, "_blank", "noopener,noreferrer");
  }
}
