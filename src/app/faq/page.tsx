import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import FAQContent from "@/components/FAQContent";
import { getFAQCatalog, getFAQForLocale, getFAQPageTitle, hasFAQContent } from "@/lib/faq";
import { getUIStrings, parseLocaleCookie } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = parseLocaleCookie((await cookies()).get("hoplog-locale")?.value);
  const ui = getUIStrings(locale);
  const catalog = getFAQCatalog();

  return {
    title: getFAQPageTitle(locale, ui, catalog),
    description: getFAQForLocale(locale, catalog)?.description,
  };
}

export default function FAQPage() {
  if (!hasFAQContent()) {
    notFound();
  }

  return <FAQContent catalog={getFAQCatalog()} />;
}
