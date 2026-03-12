import type { ShareContext, ShareProviderMeta } from "../types";
import { ShareProvider } from "../types";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.72-.065-.982-.065-1.392 0-1.929.527-1.929 1.9v2.462h3.637l-.624 3.667h-3.013v7.98C17.407 23.254 21.168 19.017 21.168 13.987c0-5.077-4.105-9.182-9.168-9.182S2.832 8.91 2.832 13.987c0 4.492 3.022 8.264 7.132 9.428a9.182 9.182 0 0 1-.863.276" />
    </svg>
  );
}

export class FacebookProvider extends ShareProvider {
  readonly meta: ShareProviderMeta = {
    key: "facebook",
    label: "Facebook",
    ariaLabel: "Share on Facebook",
  };

  icon = FacebookIcon;

  share({ url }: ShareContext): void {
    const params = new URLSearchParams({ u: url });
    window.open(`https://www.facebook.com/sharer/sharer.php?${params}`, "_blank", "noopener,noreferrer");
  }
}
