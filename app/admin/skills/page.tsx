"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Wrench,
  Save,
  X,
} from "lucide-react";
import { Skill, SkillCategory } from "@/types/portfolio";
import { initialSkills, initialSkillCategories } from "@/data/initialData";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [categories, setCategories] = useState<SkillCategory[]>(initialSkillCategories);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_skills");
      if (local) {
        setSkills(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=skills")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.skills) {
            setSkills(res.data.skills);
            try {
              localStorage.setItem("portfolio_skills", JSON.stringify(res.data.skills));
            } catch {}
          }
          if (res.data.categories) setCategories(res.data.categories);
        }
      })
      .catch(console.error);
  }, []);

  const handleOpenNew = () => {
    const newSkill: Skill = {
      id: `s-${Date.now()}`,
      name: "",
      category_id: categories[0]?.id || "cat-frontend",
      category_name: categories[0]?.name || "Frontend",
      icon: "Code",
      sort_order: skills.length + 1,
      is_active: true,
    };
    setEditingSkill(newSkill);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    const cat = categories.find((c) => c.id === editingSkill.category_id);
    const payload = {
      ...editingSkill,
      category_name: cat ? cat.name : editingSkill.category_name,
    };

    const exists = skills.some((s) => s.id === payload.id);
    const updated = exists
      ? skills.map((s) => (s.id === payload.id ? payload : s))
      : [...skills, payload];

    setSkills(updated);
    try {
      localStorage.setItem("portfolio_skills", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveSkill", payload }),
      });

      setIsModalOpen(false);
      setStatusMessage("Skill saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save skill to cloud, but saved locally.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    try {
      localStorage.setItem("portfolio_skills", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteSkill", payload: { id } }),
      });
      setStatusMessage("Skill removed.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (s: Skill) => {
    const updated = { ...s, is_active: !s.is_active };
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveSkill", payload: updated }),
      });
      setSkills(skills.map((item) => (item.id === s.id ? updated : item)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Technical Skills Manager
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Organize technologies across categories (Frontend, Backend, AI/ML, Database, Tools).
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Categorized Skills Panels */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category_id === cat.id);
          return (
            <div
              key={cat.id}
              className="bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-2xs p-5"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {catSkills.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {catSkills.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      s.is_active
                        ? "bg-[#071324]/50 border-amber-500/30"
                        : "bg-[#142c50]/40 border-amber-500/30 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Icon: {s.icon || "Code"}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(s)}
                        title={s.is_active ? "Deactivate" : "Activate"}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          s.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-[#071324] text-slate-400"
                        }`}
                      >
                        {s.is_active ? "Active" : "Off"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingSkill({ ...s });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-[#0d1f38] rounded-3xl border border-amber-500/30 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingSkill.id.startsWith("s-") ? "Add Skill" : "Edit Skill"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-amber-300 mb-1">
                  Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-amber-300 mb-1">
                  Category *
                </label>
                <select
                  value={editingSkill.category_id}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, category_id: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-amber-300 mb-1">
                  Icon Identifier
                </label>
                <input
                  type="text"
                  value={editingSkill.icon || "Code"}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, icon: e.target.value })
                  }
                  placeholder="Code, Cpu, Brain, Layers, Database..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
