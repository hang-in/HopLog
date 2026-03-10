import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getConfig } from '@/lib/config';
import AboutContent from '@/components/AboutContent';
import { getUIStrings, parseLocaleCookie } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = parseLocaleCookie((await cookies()).get("hoplog-locale")?.value);
  const ui = getUIStrings(locale);

  return {
    title: ui.header.about,
  };
}

export default async function AboutPage() {
  const { profile, social, experience, skills } = getConfig();

  return <AboutContent profile={profile} social={social} experience={experience} skills={skills} />;
}
