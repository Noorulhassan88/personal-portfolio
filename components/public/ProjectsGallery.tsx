"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Search, Cpu } from "lucide-react";
import { GithubIcon } from "@/components/shared/SocialIcons";
import { Project } from "@/types/portfolio";

interface ProjectsGalleryProps {
  initialProjects: Project[];
}

const categories = ["All", "Full Stack", "AI/ML", "Generative AI", "Web Development"];

export default function ProjectsGallery({ initialProjects }: ProjectsGalleryProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncLocal = () => {
      try {
        const local = localStorage.getItem("portfolio_projects");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjectsList(parsed.filter((p: Project) => p.is_published));
          }
        }
      } catch (e) {
        console.error("Local sync error:", e);
      }
    };

    syncLocal();

    fetch("/api/admin/data?section=projects")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && Array.isArray(res.data)) {
          const published = res.data.filter((p: Project) => p.is_published);
          setProjectsList(published);
          try {
            localStorage.setItem("portfolio_projects", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);

    const handleStorageChange = () => {
      syncLocal();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio_projects_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio_projects_updated", handleStorageChange);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(query) ||
        project.short_description.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [projectsList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-linear-to-r from-amber-400 to-amber-500 text-[#071324] font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "bg-[#0d1f38] text-neutral-300 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
          <input
            type="text"
            placeholder="Search projects or stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-[#0d1f38] border border-amber-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors shadow-md"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 sm:py-20 text-center bg-[#0d1f38] rounded-2xl border border-amber-500/20 px-4">
          <p className="text-sm font-semibold text-slate-300">
            No projects found matching the selected filter or search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 text-xs font-bold text-amber-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="interactive-card group bg-[#0d1f38] rounded-2xl border border-amber-500/30 hover:border-amber-400 overflow-hidden shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail */}
              <Link
                href={`/projects/${project.slug}`}
                className="relative block h-52 w-full overflow-hidden bg-[#071324]"
              >
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    unoptimized={
                      project.thumbnail_url.startsWith("data:") ||
                      project.thumbnail_url.startsWith("http")
                    }
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#071324] text-amber-400">
                    <Cpu className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-[#071324]/90 backdrop-blur-md text-amber-300 border border-amber-400/60 shadow-md">
                    {project.category}
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-500/15">
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#142c50] text-amber-300 border border-amber-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#142c50] text-neutral-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between text-xs">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-bold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>View Deep Dive</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </Link>

                    <div className="flex items-center gap-3 text-neutral-300">
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
      )}
    </div>
  );
}
