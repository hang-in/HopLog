"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { AnalyticsRuntimeConfig } from "@/lib/config";
import { createAnalyticsProviderCollection } from "@/lib/analytics-runtime";

interface AnalyticsRuntimeProps {
  config: AnalyticsRuntimeConfig;
}

export default function AnalyticsRuntime({ config }: AnalyticsRuntimeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const analyticsProviders = useMemo(() => createAnalyticsProviderCollection(config), [config]);

  useEffect(() => {
    analyticsProviders.initialize();

    return () => {
      analyticsProviders.dispose();
    };
  }, [analyticsProviders]);

  useEffect(() => {
    if (!config.enabled) {
      return;
    }

    const pagePath = query ? `${pathname}?${query}` : pathname;

    analyticsProviders.trackPageView({ pagePath });
  }, [analyticsProviders, config.enabled, pathname, query]);

  if (!config.enabled) {
    return null;
  }

  return <>{analyticsProviders.renderScripts({ debug: config.debug })}</>;
}
