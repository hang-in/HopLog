"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import type { AnalyticsRuntimeConfig } from "@/lib/config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => number;
    };
    _fbq?: Window["fbq"];
  }
}

interface AnalyticsRuntimeProps {
  config: AnalyticsRuntimeConfig;
}

export default function AnalyticsRuntime({ config }: AnalyticsRuntimeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const sentryInitialized = useRef(false);
  const sentryModuleRef = useRef<{
    init: (options: Record<string, unknown>) => void;
    addBreadcrumb: (breadcrumb: Record<string, unknown>) => void;
    setTag: (key: string, value: string) => void;
  } | null>(null);

  useEffect(() => {
    if (!config.sentry.enabled || !config.sentry.dsn || sentryInitialized.current) {
      return;
    }

    let active = true;

    import("@sentry/browser")
      .then((Sentry) => {
        if (!active || sentryInitialized.current) {
          return;
        }

        Sentry.init({
          dsn: config.sentry.dsn,
          enabled: true,
          environment: config.sentry.environment,
          tracesSampleRate: config.sentry.tracesSampleRate,
        });

        sentryModuleRef.current = Sentry;
        sentryInitialized.current = true;
      })
      .catch(() => {
        sentryModuleRef.current = null;
      });

    return () => {
      active = false;
    };
  }, [config.sentry.dsn, config.sentry.enabled, config.sentry.environment, config.sentry.tracesSampleRate]);

  useEffect(() => {
    if (!config.enabled) {
      return;
    }

    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (config.ga.enabled && config.ga.measurementId && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    if (config.metaPixel.enabled && config.metaPixel.pixelId && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }

    if (config.sentry.enabled && sentryModuleRef.current) {
      sentryModuleRef.current.setTag("route", pagePath);
      sentryModuleRef.current.addBreadcrumb({
        category: "navigation",
        message: pagePath,
        level: "info",
      });
    }
  }, [config.enabled, config.ga.enabled, config.ga.measurementId, config.metaPixel.enabled, config.metaPixel.pixelId, config.sentry.enabled, pathname, query]);

  if (!config.enabled) {
    return null;
  }

  return (
    <>
      {config.ga.enabled && config.ga.measurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ga.measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${config.ga.measurementId}', {
                send_page_view: false,
                debug_mode: ${config.debug ? "true" : "false"}
              });
            `}
          </Script>
        </>
      )}

      {config.metaPixel.enabled && config.metaPixel.pixelId && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;
                n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${config.metaPixel.pixelId}');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${config.metaPixel.pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
