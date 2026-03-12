import type { SharingProvider } from "@/lib/config";

export interface ShareContext {
  url: string;
  title: string;
  description?: string;
}

export interface ShareProviderMeta {
  key: SharingProvider;
  label: string;
  ariaLabel: string;
}

export abstract class ShareProvider {
  abstract readonly meta: ShareProviderMeta;
  abstract icon: React.ComponentType<{ className?: string }>;

  abstract share(context: ShareContext): void;
}
