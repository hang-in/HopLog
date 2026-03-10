"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { ProfileConfig } from "@/lib/config";
import { getUIStrings } from "@/lib/i18n";

type AboutContentProps = Pick<ProfileConfig, "profile" | "social" | "experience" | "skills">;

export default function AboutContent({ profile, social, experience, skills }: AboutContentProps) {
  const { locale } = useLocale();
  const ui = getUIStrings(locale);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-5">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {profile.name}
          <span className="text-primary">.</span>
        </h1>
        <p className="text-lg font-medium text-primary">{profile.role}</p>
        <p className="max-w-2xl text-[16px] text-muted-foreground leading-relaxed">{profile.bio}</p>

        <div className="flex gap-4 pt-1">
          <a href={`mailto:${profile.email}`} className="text-[13px] font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary">{ui.about.email}</a>
        </div>

        {social && social.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3">
            {social.map((link) => (
              <a key={`${link.platform}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-foreground text-background text-[11px] font-bold uppercase tracking-wider rounded-full hover:bg-primary transition-colors active:scale-95 inline-flex items-center gap-1.5">
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border pb-4">{ui.about.experience}</h2>
        <div className="space-y-8">
          {experience.map((exp) => (
            <div key={`${exp.company}-${exp.period}`} className="flex flex-col sm:flex-row gap-2 sm:gap-8">
              <div className="sm:w-48 shrink-0">
                <p className="text-[13px] font-mono font-medium text-muted-foreground mt-1">{exp.period}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">{exp.company}</h3>
                <p className="text-[14px] font-semibold text-primary">{exp.position}</p>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border pb-4">{ui.about.skills}</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="px-4 py-2 bg-muted text-foreground text-[13px] font-semibold rounded-full">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
