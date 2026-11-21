"use client";

import React, { useState } from "react";
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
  const [categories] = useState<SkillCategory[]>(initialSkillCategories);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveSkill", payload }),
      });

      const exists = skills.some((s) => s.id === payload.id);
      if (exists) {
        setSkills(skills.map((s) => (s.id === payload.id ? payload : s)));
      } else {
        setSkills([...skills, payload]);
      }

      setIsModalOpen(false);
      setStatusMessage("Skill saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save skill.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteSkill", payload: { id } }),
      });
      setSkills(skills.filter((s) => s.id !== id));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Technical Skills Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Organize technologies across categories (Frontend, Backend, AI/ML, Database, Tools).
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs"
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
              className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-5"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-neutral-900">{cat.name}</h3>
                <span className="text-[11px] font-mono text-neutral-400">
                  {catSkills.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {catSkills.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      s.is_active
                        ? "bg-neutral-50/50 border-neutral-200"
                        : "bg-neutral-100/40 border-neutral-200 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
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
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {s.is_active ? "Active" : "Off"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingSkill({ ...s });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-neutral-400 hover:text-blue-600 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded"
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
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingSkill.id.startsWith("s-") ? "Add Skill" : "Edit Skill"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Category *
                </label>
                <select
                  value={editingSkill.category_id}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, category_id: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Icon Identifier
                </label>
                <input
                  type="text"
                  value={editingSkill.icon || "Code"}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, icon: e.target.value })
                  }
                  placeholder="Code, Cpu, Brain, Layers, Database..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 font-semibold"
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
