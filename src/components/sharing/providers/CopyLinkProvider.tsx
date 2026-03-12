import { Link } from "lucide-react";
import type { ShareContext, ShareProviderMeta } from "../types";
import { ShareProvider } from "../types";

export class CopyLinkProvider extends ShareProvider {
  readonly meta: ShareProviderMeta = {
    key: "copyLink",
    label: "Copy Link",
    ariaLabel: "Copy link to clipboard",
  };

  icon = Link;

  share({ url }: ShareContext): void {
    navigator.clipboard.writeText(url);
  }
}
