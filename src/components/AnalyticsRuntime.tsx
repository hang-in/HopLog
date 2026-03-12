"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { AnalyticsRuntimeConfig } from "@/lib/config";
import {
  createAnalyticsProviderCollection,
  AnalyticsProviderCollection,
} from "@/lib/analytics-runtime";

interface AnalyticsRuntimeProps {
  config: AnalyticsRuntimeConfig;
}

export default function AnalyticsRuntime({ config }: AnalyticsRuntimeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [providers, setProviders] = useState<AnalyticsProviderCollection | null>(null);

  useEffect(() => {
    let cancelled = false;

    createAnalyticsProviderCollection(config).then((collection) => {
      if (!cancelled) {
        setProviders(collection);
        collection.initialize();
      }
    });

    return () => {
      cancelled = true;
      providers?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    if (!config.enabled || !providers) {
      return;
    }

    const pagePath = query ? `${pathname}?${query}` : pathname;
    providers.trackPageView({ pagePath });
  }, [providers, config.enabled, pathname, query]);

  if (!config.enabled || !providers) {
    return null;
  }

  return <>{providers.renderScripts({ debug: config.debug })}</>;
}
