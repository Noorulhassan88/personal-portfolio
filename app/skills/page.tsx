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
    <div className="min-h-screen flex flex-col bg-[#071324] text-white">
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
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                        {category.name}
                      </h2>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-[#0d1f38] px-3 py-1 rounded-full border border-amber-400/40">
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
                          className="interactive-card active:scale-95 cursor-pointer group p-4 rounded-xl bg-[#0d1f38] border border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center text-center gap-3 shadow-lg"
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#071324] text-amber-400 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-[#071324] transition-all duration-200 border border-amber-500/40 shadow-xs">
                            <Icon className="w-6 h-6" />
                          </div>

                          <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 tracking-tight transition-colors">
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
