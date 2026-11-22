"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  CheckCircle2,
  X,
  Save,
  Search,
  Upload,
  Loader2,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { Project } from "@/types/portfolio";
import { initialProjects } from "@/data/initialData";
import { slugify } from "@/lib/utils";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingAll, setSavingAll] = useState(false);

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_projects");
      if (local) {
        setProjects(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=projects")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setProjects(res.data);
          try {
            localStorage.setItem("portfolio_projects", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveAll = async () => {
    setSavingAll(true);
    setStatusMessage("");

    // 1. Immediately sync to local storage & trigger live events across open tabs
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(projects));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
    } catch (e) {
      console.error(e);
    }

    // 2. Persist to Supabase database via API
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveAllProjects",
          payload: projects,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to save projects to database.");
      }

      if (resData.data && Array.isArray(resData.data)) {
        setProjects(resData.data);
        try {
          localStorage.setItem("portfolio_projects", JSON.stringify(resData.data));
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
        } catch {}
      }

      setStatusMessage("All projects saved and synchronized successfully!");
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err) {
      console.error("Save all projects error:", err);
      setStatusMessage("Saved locally. Database sync failed.");
      setTimeout(() => setStatusMessage(""), 4000);
    } finally {
      setSavingAll(false);
    }
  };

  const handleTogglePublish = (p: Project) => {
    const updated = projects.map((item) =>
      item.id === p.id ? { ...item, is_published: !item.is_published } : item
    );
    setProjects(updated);
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = (p: Project) => {
    const updated = projects.map((item) =>
      item.id === p.id ? { ...item, is_featured: !item.is_featured } : item
    );
    setProjects(updated);
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    const updated = reordered.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setProjects(updated);
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNew = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: "",
      slug: "",
      category: "Full Stack",
      short_description: "",
      full_description: "",
      technologies: ["React", "Next.js", "TypeScript"],
      thumbnail_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      screenshots: [],
      problem_statement: "",
      solution: "",
      key_features: [],
      technical_implementation: "",
      challenges_solutions: [],
      results_metrics: [],
      is_published: true,
      is_featured: false,
      sort_order: projects.length + 1,
    };
    setEditingProject(newProject);
    setIsModalOpen(true);
  };

  const handleEdit = (p: Project) => {
    setEditingProject({ ...p });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditingProject({
          ...editingProject,
          thumbnail_url: data.url,
        });
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDuplicate = async (p: Project) => {
    const dup: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy`,
      is_featured: false,
      sort_order: projects.length + 1,
    };

    const updated = [...projects, dup];
    setProjects(updated);
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveProject", payload: dup }),
      });
      setStatusMessage("Project duplicated successfully.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteProject", payload: { id } }),
      });
      setStatusMessage("Project deleted.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const payload = {
      ...editingProject,
      slug: editingProject.slug || slugify(editingProject.title),
    };

    const exists = projects.some((p) => p.id === payload.id);
    const updated = exists
      ? projects.map((p) => (p.id === payload.id ? payload : p))
      : [...projects, payload];

    setProjects(updated);
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_projects_updated"));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveProject", payload }),
      });

      setIsModalOpen(false);
      setStatusMessage("Project saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save project to cloud, but saved locally.");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Projects Manager</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
              {projects.length} Projects
            </span>
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Create, edit, duplicate, reorder, publish, and feature your software & AI projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={savingAll}
            className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all cursor-pointer disabled:opacity-50"
          >
            {savingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#071324]" />
                <span>Saving All...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d1f38] hover:bg-[#142c50] border border-amber-400/60 text-amber-300 font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-amber-500/20 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-amber-500/30 text-xs text-white"
            />
          </div>
          <span className="text-xs text-amber-200/80 font-mono">
            {filteredProjects.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071324] border-b border-amber-500/20 text-amber-200/80 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Order</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 text-slate-100">
              {filteredProjects.map((p, idx) => (
                <tr key={p.id} className="hover:bg-[#071324]/60 transition-colors">
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-[#142c50] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(idx, "down")}
                        disabled={idx === filteredProjects.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-[#142c50] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {p.thumbnail_url && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#142c50] border border-amber-500/30">
                          <Image
                            src={p.thumbnail_url}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white">{p.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          /{p.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-[#142c50] text-amber-300 font-medium border border-amber-400/30">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(p)}
                      title="Click to toggle publish status"
                      className={`px-3 py-1 rounded-full font-bold text-[10px] transition-all cursor-pointer border ${
                        p.is_published
                          ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25"
                          : "bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(p)}
                      title="Click to toggle featured status"
                      className={`px-3 py-1 rounded-full font-bold text-[10px] transition-all cursor-pointer border ${
                        p.is_featured
                          ? "bg-amber-400/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                          : "bg-slate-800/40 border-slate-700 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {p.is_featured ? "Featured" : "No"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#142c50] transition-colors"
                        title="View Live Detail Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-[#142c50] transition-colors cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-[#142c50] transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#142c50] transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Save Bar */}
      <div className="sticky bottom-4 z-40 bg-[#0d1f38]/95 backdrop-blur-md p-4 rounded-2xl border-2 border-amber-400/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <div>
            <p className="text-xs font-bold text-white tracking-wide">
              {projects.length} Total Projects ({projects.filter((p) => p.is_published).length} Published, {projects.filter((p) => p.is_featured).length} Featured)
            </p>
            <p className="text-[11px] text-amber-200/70">
              Click &quot;Save Changes&quot; to commit project records and sync with live portfolio.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={savingAll}
          className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] tracking-wide transition-all cursor-pointer disabled:opacity-50"
        >
          {savingAll ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#071324]" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-[#0d1f38] rounded-3xl border border-amber-500/30 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-amber-500/20 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {editingProject.id.startsWith("proj-")
                  ? "Create New Project"
                  : `Edit: ${editingProject.title}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#142c50]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        title: e.target.value,
                        slug: slugify(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as Project["category"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-white bg-[#0d1f38]"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Generative AI">Generative AI</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={editingProject.is_published ? "true" : "false"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        is_published: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-white bg-[#0d1f38]"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Featured on Home
                  </label>
                  <select
                    value={editingProject.is_featured ? "true" : "false"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        is_featured: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-white bg-[#0d1f38]"
                  >
                    <option value="true">Yes (Featured)</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.short_description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Full Detailed Overview *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.full_description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      full_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.problem_statement}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        problem_statement: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Proposed Solution
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.solution}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        solution: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github_url || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        github_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.live_demo_url || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        live_demo_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Thumbnail Image (Upload File or Enter URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.thumbnail_url}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        thumbnail_url: e.target.value,
                      })
                    }
                    placeholder="https://... or upload photo"
                    className="flex-1 px-3 py-2 rounded-xl border border-amber-500/30 text-xs bg-[#071324] text-white"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 border-t border-amber-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-semibold text-amber-300 hover:bg-[#071324]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] text-xs font-extrabold border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
