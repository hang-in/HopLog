import { getConfig } from '@/lib/config';
import { Keyboard } from 'lucide-react';

export default async function AboutPage() {
  const { profile, social, experience, skills } = getConfig();

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Profile Section */}
      <section className="space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {profile.name}
          <span className="text-primary">.</span>
        </h1>
        <p className="text-lg font-medium text-primary">
          {profile.role}
        </p>
        <p className="max-w-2xl text-[16px] text-muted-foreground leading-relaxed">
          {profile.bio}
        </p>

        <div className="flex gap-4 pt-2">
          <a href={`mailto:${profile.email}`} className="text-[13px] font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary">Email</a>
        </div>

        {social && social.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {social.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-foreground text-background text-[11px] font-bold uppercase tracking-wider rounded-full hover:bg-primary transition-colors active:scale-95 inline-flex items-center gap-1.5">
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section className="space-y-8">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border pb-4">Experience</h2>
        <div className="space-y-12">
          {experience.map((exp, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-8">
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

      {/* Skills Section */}
      <section className="space-y-8">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border pb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span key={idx} className="px-4 py-2 bg-muted text-foreground text-[13px] font-semibold rounded-full">{skill}</span>
          ))}
        </div>
      </section>

    </div>
  );
}
