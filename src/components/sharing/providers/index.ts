import type { SharingProvider } from "@/lib/config";
import type { ShareProvider } from "../types";
import { TwitterProvider } from "./TwitterProvider";
import { FacebookProvider } from "./FacebookProvider";
import { LinkedInProvider } from "./LinkedInProvider";
import { CopyLinkProvider } from "./CopyLinkProvider";

const PROVIDER_MAP: Record<SharingProvider, () => ShareProvider> = {
  twitter: () => new TwitterProvider(),
  facebook: () => new FacebookProvider(),
  linkedin: () => new LinkedInProvider(),
  copyLink: () => new CopyLinkProvider(),
};

export function resolveProviders(keys: SharingProvider[]): ShareProvider[] {
  return keys
    .filter((key) => key in PROVIDER_MAP)
    .map((key) => PROVIDER_MAP[key]());
}
