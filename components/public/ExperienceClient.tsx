"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { ExperienceEntry, HomepageSettings } from "@/types/portfolio";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExperienceClientProps {
  initialExperience: ExperienceEntry[];
  settings: HomepageSettings;
}

export default function ExperienceClient({
  initialExperience,
  settings,
}: ExperienceClientProps) {
  const [experience, setExperience] = useState<ExperienceEntry[]>(initialExperience);

  useEffect(() => {
    const syncLocal = () => {
      try {
        const local = localStorage.getItem("portfolio_experience");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setExperience(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncLocal();

    fetch("/api/admin/data?section=experience")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setExperience(res.data);
          try {
            localStorage.setItem("portfolio_experience", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);

    const handleStorageChange = () => {
      syncLocal();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio_experience_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio_experience_updated", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#071324] text-white">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="CAREER MILESTONES"
          title="Experience & Timeline"
          description="Chronological overview of my professional engineering experience, research contributions, and career achievements."
          breadcrumb="Experience"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="relative border-l-2 border-amber-500/40 ml-4 sm:ml-8 space-y-12">
            {experience.map((entry) => (
              <div key={entry.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
                    entry.is_current
                      ? "border-amber-400 bg-amber-400 shadow-[0_0_12px_#f59e0b] ring-4 ring-amber-400/20"
                      : "border-amber-400/60 bg-[#071324]"
                  }`}
                />

                {/* Entry Card */}
                <div className="interactive-card p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-xl transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#142c50] text-amber-300 border border-amber-400/50 w-fit">
                      {entry.type}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-amber-200/80 font-mono font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {formatDate(entry.start_date)} –{" "}
                        {entry.is_current ? "Present" : formatDate(entry.end_date)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {entry.designation}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-amber-300 font-semibold mt-1 mb-4">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      {entry.organization}
                    </span>
                    {entry.location && (
                      <span className="flex items-center gap-1 text-slate-300 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {entry.location}
                      </span>
                    )}
                  </div>

                  {/* Responsibilities list */}
                  {entry.responsibilities && entry.responsibilities.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {entry.responsibilities.map((resp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs sm:text-sm text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technology Tags */}
                  {entry.technologies && entry.technologies.length > 0 && (
                    <div className="pt-4 border-t border-amber-500/20 flex flex-wrap gap-1.5">
                      {entry.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#071324] text-amber-300 border border-amber-500/30"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
