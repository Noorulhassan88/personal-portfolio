"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { AboutContent, HomepageSettings } from "@/types/portfolio";
import {
  GraduationCap,
  Sparkles,
  Layers,
  Cpu,
  Binary,
  Database,
  Brain,
  Terminal,
  Code,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface AboutClientProps {
  initialAbout: AboutContent;
  settings: HomepageSettings;
}

const iconMap: Record<string, React.ElementType> = {
  Layers,
  Cpu,
  Binary,
  Database,
  Brain,
  Terminal,
  Code,
  Sparkles,
};

export default function AboutClient({ initialAbout, settings }: AboutClientProps) {
  const [about, setAbout] = useState<AboutContent>(() => {
    const sanitizeDesc = (desc?: string) => {
      if (!desc || desc.includes("development philosophy")) {
        return "Discover my background, education, and technical expertise in building scalable software systems and applied AI.";
      }
      return desc;
    };
    return {
      ...initialAbout,
      header_description: sanitizeDesc(initialAbout.header_description),
    };
  });

  useEffect(() => {
    const sanitizeDesc = (desc?: string) => {
      if (!desc || desc.includes("development philosophy")) {
        return "Discover my background, education, and technical expertise in building scalable software systems and applied AI.";
      }
      return desc;
    };

    const syncLocal = () => {
      try {
        const local = localStorage.getItem("portfolio_about");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.header_description) {
            parsed.header_description = sanitizeDesc(parsed.header_description);
          }
          if (parsed.career_objectives && parsed.career_objectives.includes("development philosophy")) {
            parsed.career_objectives = sanitizeDesc(parsed.career_objectives);
          }
          setAbout((prev) => ({ ...prev, ...parsed, header_description: sanitizeDesc(parsed.header_description) }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncLocal();

    fetch("/api/admin/data?section=about")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const cleanData = {
            ...res.data,
            header_description: sanitizeDesc(res.data.header_description),
          };
          setAbout((prev) => ({ ...prev, ...cleanData }));
          try {
            localStorage.setItem("portfolio_about", JSON.stringify(cleanData));
          } catch {}
        }
      })
      .catch(console.error);

    const handleStorageChange = (e: Event) => {
      syncLocal();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio_about_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio_about_updated", handleStorageChange);
    };
  }, []);

  const headerDesc =
    about.header_description && !about.header_description.includes("development philosophy")
      ? about.header_description
      : "Discover my background, education, and technical expertise in building scalable software systems and applied AI.";

  return (
    <div className="min-h-screen flex flex-col bg-[#071324] text-white">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="ABOUT ME"
          title={
            about.header_title ||
            "Bridging Artificial Intelligence with Modern Web Architecture."
          }
          description={headerDesc}
          breadcrumb="About"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Left 8 Cols: Editorial Biography & Academic Education */}
            <div className="lg:col-span-8 space-y-10 sm:space-y-16">
              {/* Biography Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                  <span>BIOGRAPHY</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6">
                  Software Engineering Grounded in Applied AI
                </h2>
                <div className="space-y-4 text-slate-300 leading-relaxed text-base sm:text-lg">
                  {about.bio_paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </section>

              {/* Education Section */}
              <section className="pt-8 border-t border-amber-500/30">
                <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>ACADEMIC FOUNDATION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6">
                  Education
                </h2>

                <div className="space-y-6">
                  {about.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="interactive-card p-5 sm:p-6 md:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-xl transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {edu.degree}
                        </h3>
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#142c50] text-amber-300 border border-amber-400/50 self-start sm:self-auto shrink-0">
                          {edu.start_year} – {edu.end_year}
                        </span>
                      </div>

                      <div className="text-sm font-semibold text-amber-300 mb-3">
                        {edu.institution}
                      </div>

                      {edu.grade && (
                        <div className="inline-block text-xs font-bold text-amber-300 bg-[#071324] border border-amber-400/40 rounded-md px-2.5 py-1 mb-4 shadow-xs">
                          {edu.grade}
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          {edu.description}
                        </p>
                      )}

                      {edu.highlights && edu.highlights.length > 0 && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-amber-500/20">
                          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                            Academic & Technical Highlights
                          </h4>
                          <ul className="space-y-2">
                            {edu.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs sm:text-sm text-slate-300"
                              >
                                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right 4 Cols: Areas of Specialization & Core Interests */}
            <div className="lg:col-span-4 space-y-8">
              {/* Areas of Specialization */}
              {about.areas_of_specialization &&
                about.areas_of_specialization.length > 0 && (
                  <div className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Areas of Specialization</span>
                    </h3>
                    <div className="space-y-4">
                      {about.areas_of_specialization.map((spec, i) => {
                        const IconComp = iconMap[spec.icon] || Sparkles;
                        return (
                          <div key={i} className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#071324] text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-xs">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">
                                {spec.title}
                              </h4>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                {spec.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Technical Interests Tag Cloud */}
              {about.technical_interests &&
                about.technical_interests.length > 0 && (
                  <div className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-4">
                      Core Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {about.technical_interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-[#071324] border border-amber-500/30 text-amber-300 hover:border-amber-400 transition-colors"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Direct Next Action Card - Deep Navy & Gold */}
              <div className="p-6 rounded-2xl bg-[#0a192f] text-white shadow-xl border-2 border-amber-400/50">
                <h3 className="text-lg font-bold mb-2 text-white">
                  Technical Arsenal
                </h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  Explore full stack libraries, machine learning frameworks, and database
                  architectures in detail.
                </p>
                <Link
                  href="/skills"
                  className="btn-shine active:scale-95 cursor-pointer w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] text-sm font-extrabold transition-all shadow-[0_0_15px_rgba(245,158,11,0.35)] border border-amber-300"
                >
                  <span>Explore Technical Skills</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer
        name={settings.name}
        designation={settings.designation}
        githubUrl={settings.social_github}
        linkedinUrl={settings.social_linkedin}
        email={settings.social_email}
      />
    </div>
  );
}
