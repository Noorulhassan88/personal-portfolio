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

// Technology Icon resolver
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
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
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
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        {category.name}
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">
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
                          className="group p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 hover:translate-y-[-2px] transition-all duration-200 flex flex-col items-center justify-center text-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-neutral-50 text-neutral-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>

                          <span className="text-xs sm:text-sm font-semibold text-neutral-800 tracking-tight">
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
