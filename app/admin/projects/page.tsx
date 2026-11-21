"use client";

import React, { useState } from "react";
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

  const handleDuplicate = async (p: Project) => {
    const dup: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy`,
      is_featured: false,
      sort_order: projects.length + 1,
    };

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveProject", payload: dup }),
      });
      setProjects([...projects, dup]);
      setStatusMessage("Project duplicated successfully.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteProject", payload: { id } }),
      });
      setProjects(projects.filter((p) => p.id !== id));
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

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveProject", payload }),
      });

      const exists = projects.some((p) => p.id === payload.id);
      if (exists) {
        setProjects(projects.map((p) => (p.id === payload.id ? payload : p)));
      } else {
        setProjects([...projects, payload]);
      }

      setIsModalOpen(false);
      setStatusMessage("Project saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save project.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Projects Manager (CRUD)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Create, edit, duplicate, publish, and feature your software & AI projects.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-900"
            />
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {filteredProjects.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {p.thumbnail_url && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                          <Image
                            src={p.thumbnail_url}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-neutral-900">{p.title}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          /{p.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        p.is_published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.is_featured ? (
                      <span className="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-blue-50 text-blue-700">
                        Yes
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[10px]">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                        title="View Live Detail Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-neutral-100"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-neutral-100"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-neutral-100"
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

      {/* Editor Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">
                {editingProject.id.startsWith("proj-")
                  ? "Create New Project"
                  : `Edit: ${editingProject.title}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-white"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Generative AI">Generative AI</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-white"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-white"
                  >
                    <option value="true">Yes (Featured)</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={editingProject.thumbnail_url}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      thumbnail_url: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div className="p-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
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
