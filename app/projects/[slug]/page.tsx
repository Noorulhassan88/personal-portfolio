import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getProjectBySlug, getProjects, getHomepageSettings } from "@/lib/db";
import {
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { GithubIcon } from "@/components/shared/SocialIcons";

export const revalidate = 0;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Noorul Hassan`,
    description: project.short_description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getHomepageSettings(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        {/* Header Breadcrumb & Title: Navy & Gold Gradient */}
        <div className="pt-28 pb-10 md:pt-36 md:pb-12 border-b border-amber-500/20 bg-linear-to-b from-[#0a192f] to-[#112240] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-amber-300/80 mb-4 font-mono">
              <Link href="/" className="hover:text-amber-200 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500/60" />
              <Link href="/projects" className="hover:text-amber-200 transition-colors">
                Projects
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500/60" />
              <span className="text-white font-semibold">{project.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-mono font-bold">
                {project.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl">
              {project.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
              {project.short_description}
            </p>

            {/* Links Bar */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-amber-500/20">
              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0a192f] text-xs font-bold transition-colors shadow-md"
                >
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  <span>Launch Live Demo</span>
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1b2f56] hover:bg-[#233e70] text-amber-200 border border-amber-400/50 text-xs font-bold transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-amber-400" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 Cols: Deep Details */}
            <div className="lg:col-span-8 space-y-14">
              {/* Main Showcase Image */}
              {project.thumbnail_url && (
                <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl bg-[#0a192f]">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Overview & Problem Statement */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0a192f]">
                  Project Overview
                </h2>
                <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
                  {project.full_description}
                </p>
              </section>

              {/* Problem & Solution Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>The Problem Statement</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {project.problem_statement}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
                  <div className="flex items-center gap-2 text-[#0a192f] font-bold text-sm mb-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Proposed Solution</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </section>

              {/* Architecture Section */}
              {(project.architecture_notes || project.architecture_diagram_url) && (
                <section className="p-6 sm:p-8 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-6">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0a192f]">
                      System Architecture & Pipeline
                    </h2>
                  </div>

                  {project.architecture_notes && (
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 font-mono text-xs sm:text-sm text-neutral-800 leading-relaxed">
                      {project.architecture_notes}
                    </div>
                  )}

                  {project.architecture_diagram_url && (
                    <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                      <Image
                        src={project.architecture_diagram_url}
                        alt={`${project.title} Architecture`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </section>
              )}

              {/* Key Features */}
              {project.key_features && project.key_features.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0a192f]">
                    Key Features & Capabilities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.key_features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-amber-300 flex items-start gap-3 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-neutral-800 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Implementation */}
              {project.technical_implementation && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0a192f]">
                    Technical Implementation
                  </h2>
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {project.technical_implementation}
                  </div>
                </section>
              )}

              {/* Challenges and Solutions */}
              {project.challenges_solutions && project.challenges_solutions.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0a192f]">
                    Challenges & Engineering Solutions
                  </h2>
                  <div className="space-y-4">
                    {project.challenges_solutions.map((item, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2"
                      >
                        <div className="text-xs font-bold text-red-600 uppercase tracking-wider">
                          Challenge: {item.challenge}
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed pl-3 border-l-2 border-amber-500">
                          <strong className="text-amber-800 font-semibold">Solution: </strong>
                          {item.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Results and Metrics */}
              {project.results_metrics && project.results_metrics.length > 0 && (
                <section className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-white border border-amber-300 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-800">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg sm:text-xl font-bold">
                      Key Results & Empirical Metrics
                    </h2>
                  </div>
                  <ul className="space-y-2.5">
                    {project.results_metrics.map((metric, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm text-neutral-800 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right 4 Cols: Sidebar Tech Specs */}
            <div className="lg:col-span-4 space-y-8">
              <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-md space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a192f] mb-3">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 border border-amber-200 text-amber-900"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Domain</span>
                    <span className="font-bold text-[#0a192f]">{project.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Author</span>
                    <span className="font-bold text-[#0a192f]">Noorul Hassan</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Status</span>
                    <span className="text-amber-800 font-bold">Published & Verified</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-[#112240] text-amber-300 text-xs font-bold transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Live Demo</span>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-amber-50 text-[#0a192f] border border-amber-300 text-xs font-bold transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>Inspect Codebase</span>
                    </a>
                  )}
                </div>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0a192f] hover:text-amber-600 transition-colors p-2"
              >
                <ArrowLeft className="w-4 h-4 text-amber-600" />
                <span>Back to All Projects</span>
              </Link>
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
