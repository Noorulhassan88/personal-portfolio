import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { getAboutContent, getHomepageSettings } from "@/lib/db";
import {
  GraduationCap,
  Sparkles,
  Layers,
  Cpu,
  Binary,
  Database,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export const metadata = {
  title: "About Me | Noorul Hassan",
  description:
    "Biography, education at B.S. Abdur Rahman Crescent Institute of Science and Technology, technical philosophy, and areas of specialization.",
};

const iconMap: Record<string, React.ElementType> = {
  Layers,
  Cpu,
  Binary,
  Database,
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    getAboutContent(),
    getHomepageSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="ABOUT ME"
          title="Bridging Artificial Intelligence with Modern Web Architecture."
          description="Discover my background, education, development philosophy, and dedication to building scalable software systems."
          breadcrumb="About"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left 8 Cols: Editorial Biography & Education */}
            <div className="lg:col-span-8 space-y-16">
              {/* Biography Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>BIOGRAPHY</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-6">
                  Software Engineering Grounded in Applied AI
                </h2>
                <div className="space-y-4 text-neutral-600 leading-relaxed text-base sm:text-lg">
                  {about.bio_paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </section>

              {/* Education Section */}
              <section className="pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>ACADEMIC FOUNDATION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-6">
                  Education
                </h2>

                <div className="space-y-6">
                  {about.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-neutral-900">
                          {edu.degree}
                        </h3>
                        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 shrink-0">
                          {edu.start_year} – {edu.end_year}
                        </span>
                      </div>

                      <div className="text-sm font-medium text-neutral-700 mb-3">
                        {edu.institution}
                      </div>

                      {edu.grade && (
                        <div className="inline-block text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-2 py-0.5 mb-4">
                          {edu.grade}
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                          {edu.description}
                        </p>
                      )}

                      {edu.highlights && edu.highlights.length > 0 && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-neutral-100">
                          <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                            Academic & Technical Highlights
                          </h4>
                          <ul className="space-y-2">
                            {edu.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
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

              {/* Development Philosophy & Career Objectives */}
              <section className="pt-8 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/90">
                  <h3 className="text-base font-bold text-neutral-900 mb-2">
                    Development Philosophy
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {about.development_philosophy}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-neutral-200/90">
                  <h3 className="text-base font-bold text-neutral-900 mb-2">
                    Career Objectives
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {about.career_objectives}
                  </p>
                </div>
              </section>
            </div>

            {/* Right 4 Cols: Technical Interests & Specialization */}
            <div className="lg:col-span-4 space-y-8">
              {/* Specialization Cards */}
              <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                  Areas of Specialization
                </h3>
                <div className="space-y-4">
                  {about.areas_of_specialization.map((spec, i) => {
                    const IconComp = iconMap[spec.icon] || Sparkles;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">
                            {spec.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            {spec.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technical Interests Tag Cloud */}
              <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                  Core Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {about.technical_interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-colors"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Next Action Card */}
              <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-md">
                <h3 className="text-lg font-bold mb-2">View Technical Arsenal</h3>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                  Explore full stack libraries, machine learning frameworks, and database
                  architectures in detail.
                </p>
                <Link
                  href="/skills"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold transition-colors"
                >
                  <span>Explore Technical Skills</span>
                  <ArrowRight className="w-4 h-4" />
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
