import { AnalyticsProvider } from "./analytics-runtime";

interface SentryModule {
  init: (options: Record<string, unknown>) => void;
  addBreadcrumb: (breadcrumb: Record<string, unknown>) => void;
  setTag: (key: string, value: string) => void;
}

export class SentryProvider extends AnalyticsProvider {
  private initialized = false;

  private active = false;

  private sentryModule: SentryModule | null = null;

  constructor(
    private readonly dsn?: string,
    private readonly environment?: string,
    private readonly tracesSampleRate = 1,
  ) {
    super("sentry", Boolean(dsn));
  }

  override initialize(): void {
    if (!this.enabled || !this.dsn || this.initialized) {
      return;
    }

    this.active = true;

    void import("@sentry/browser")
      .then((Sentry) => {
        if (!this.active || this.initialized) {
          return;
        }

        Sentry.init({
          dsn: this.dsn,
          enabled: true,
          environment: this.environment,
          tracesSampleRate: this.tracesSampleRate,
        });

        this.sentryModule = Sentry;
        this.initialized = true;
      })
      .catch(() => {
        this.sentryModule = null;
      });
  }

  override dispose(): void {
    this.active = false;
  }

  override trackPageView({ pagePath }: { pagePath: string }): void {
    if (!this.enabled || !this.sentryModule) {
      return;
    }

    this.sentryModule.setTag("route", pagePath);
    this.sentryModule.addBreadcrumb({
      category: "navigation",
      message: pagePath,
      level: "info",
    });
  }
}
