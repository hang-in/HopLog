import enMessages from "../../messages/en.json";
import jaMessages from "../../messages/ja.json";
import koMessages from "../../messages/ko.json";
import zhMessages from "../../messages/zh.json";

export const SUPPORTED_LOCALES = ["en", "ko", "ja", "zh"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
};

const HTML_LANG: Record<Locale, string> = {
  en: "en",
  ko: "ko",
  ja: "ja",
  zh: "zh-CN",
};

const MESSAGE_CATALOGS = {
  en: enMessages,
  ko: koMessages,
  ja: jaMessages,
  zh: zhMessages,
} as const;

type MessageCatalog = (typeof MESSAGE_CATALOGS)[typeof DEFAULT_LOCALE];

type ActivityStrings = Omit<
  MessageCatalog["activity"],
  "postsLabelTemplate" | "contributionsLabelTemplate"
> & {
  postsLabel: (count: number) => string;
  contributionsLabel: (count: number) => string;
};

export type UIStrings = Omit<MessageCatalog, "activity"> & {
  activity: ActivityStrings;
};

export function getHtmlLang(locale: Locale): string {
  return HTML_LANG[locale];
}

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function parseLocaleCookie(cookieValue?: string): Locale {
  if (!cookieValue) {
    return DEFAULT_LOCALE;
  }

  return isLocale(cookieValue) ? cookieValue : DEFAULT_LOCALE;
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

export function getMessageCatalog(locale: string): MessageCatalog {
  return MESSAGE_CATALOGS[isLocale(locale) ? locale : DEFAULT_LOCALE];
}

export function getUIStrings(locale: string): UIStrings {
  const messages = getMessageCatalog(locale);

  return {
    ...messages,
    activity: {
      ...messages.activity,
      postsLabel: (count: number) =>
        formatMessage(messages.activity.postsLabelTemplate, { count }),
      contributionsLabel: (count: number) =>
        formatMessage(messages.activity.contributionsLabelTemplate, { count }),
    },
  };
}
