import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { getExperience, getHomepageSettings } from "@/lib/db";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export const metadata = {
  title: "Experience & Timeline | Noorul Hassan",
  description:
    "Professional journey, internships, technical training, and engineering contributions in AI and Full Stack Development.",
};

export default async function ExperiencePage() {
  const [experience, settings] = await Promise.all([
    getExperience(true),
    getHomepageSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="JOURNEY & CAREER"
          title="Professional Experience"
          description="Chronological timeline of engineering roles, AI research contributions, technical training, and project development."
          breadcrumb="Experience"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="relative border-l-2 border-neutral-200 ml-4 sm:ml-8 space-y-12">
            {experience.map((entry) => (
              <div key={entry.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition-colors duration-200 ${
                    entry.is_current
                      ? "border-blue-600 bg-blue-600 shadow-sm"
                      : "border-neutral-400 group-hover:border-blue-600"
                  }`}
                />

                {/* Entry Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 w-fit">
                      {entry.type}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {formatDate(entry.start_date)} –{" "}
                        {entry.is_current ? "Present" : formatDate(entry.end_date)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                    {entry.designation}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-700 font-medium mt-1 mb-4">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      {entry.organization}
                    </span>
                    {entry.location && (
                      <span className="flex items-center gap-1 text-neutral-500 text-xs">
                        <MapPin className="w-3.5 h-3.5" />
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
                          className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technology Tags */}
                  {entry.technologies && entry.technologies.length > 0 && (
                    <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-1.5">
                      {entry.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700"
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
