import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { getSkillCategories, getSkills, getHomepageSettings } from "@/lib/db";
import {
  Code,
  Palette,
  FileCode,
  FileType,
  Atom,
  Globe,
  Sparkles,
  Terminal,
  Server,
  Zap,
  Network,
  Database,
  Brain,
  Cpu,
  MessageSquare,
  Bot,
  Workflow,
  Sliders,
  Link as LinkIcon,
  Flame,
  Activity,
  ShieldCheck,
  Search,
  Layers,
  GitBranch,
  GitCommit,
  Box,
  Cloud,
  Smile,
  Code2,
} from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Technical Skills | Noorul Hassan",
  description:
    "Comprehensive skills across Frontend, Backend, AI & Machine Learning, Databases, and DevOps Tools.",
};

const iconComponents: Record<string, React.ElementType> = {
  Code,
  Palette,
  FileCode,
  FileType,
  Atom,
  Globe,
  Sparkles,
  Terminal,
  Server,
  Zap,
  Network,
  Database,
  Brain,
  Cpu,
  MessageSquare,
  Bot,
  Workflow,
  Sliders,
  Link: LinkIcon,
  Flame,
  FlameKindling: Flame,
  Activity,
  ShieldCheck,
  Search,
  Layers,
  GitBranch,
  GitCommit,
  Box,
  Cloud,
  Smile,
  Code2,
};

export default async function SkillsPage() {
  const [categories, skills, settings] = await Promise.all([
    getSkillCategories(),
    getSkills(true),
    getHomepageSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="TECHNICAL ARSENAL"
          title="Skills & Technologies"
          description="Categorized breakdown of technical capabilities across full stack engineering, artificial intelligence, vector search, and development tooling."
          breadcrumb="Skills"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-16">
            {categories.map((category) => {
              const categorySkills = skills.filter(
                (s) => s.category_id === category.id
              );

              return (
                <section key={category.id} className="space-y-6">
                  {/* Category Header with Gold/Navy accents */}
                  <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0a192f]">
                        {category.name}
                      </h2>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {categorySkills.length} technologies
                    </span>
                  </div>

                  {/* Skills Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categorySkills.map((skill) => {
                      const Icon = (skill.icon && iconComponents[skill.icon]) || Code;
                      return (
                        <div
                          key={skill.id}
                          className="group p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 hover:translate-y-[-2px] transition-all duration-200 flex flex-col items-center justify-center text-center gap-3"
                        >
                          <div className="w-11 h-11 rounded-xl bg-[#0a192f] text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-[#0a192f] transition-all duration-200 shadow-xs">
                            <Icon className="w-5 h-5" />
                          </div>

                          <span className="text-xs sm:text-sm font-bold text-[#0a192f] tracking-tight">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
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
