import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Cpu } from "lucide-react";
import { GithubIcon } from "@/components/shared/SocialIcons";
import { Project } from "@/types/portfolio";

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="py-20 md:py-28 bg-[#071324] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400 text-amber-300 text-xs font-mono font-bold tracking-wide mb-3 shadow-sm">
              SELECTED WORK
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Featured Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-[#0d1f38] rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-amber-400 transition-all duration-300 flex flex-col"
            >
              {/* Project Thumbnail Image */}
              <Link
                href={`/projects/${project.slug}`}
                className="relative block h-48 sm:h-52 w-full overflow-hidden bg-[#071324]"
              >
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#071324] text-amber-400">
                    <Cpu className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-[#071324]/90 backdrop-blur-xs text-amber-300 shadow-md border border-amber-400/50">
                    {project.category}
                  </span>
                </div>
              </Link>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-500/20">
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#071324] text-amber-300 border border-amber-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#071324] text-amber-300 border border-amber-500/30">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between text-xs">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-bold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-3 text-slate-300">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-amber-400 transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-amber-400 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
