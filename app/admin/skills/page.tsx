"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Save,
  X,
} from "lucide-react";
import { Skill, SkillCategory } from "@/types/portfolio";
import { initialSkills, initialSkillCategories } from "@/data/initialData";

const commonIcons = [
  "Code",
  "Cpu",
  "Brain",
  "Database",
  "Layers",
  "Terminal",
  "Sparkles",
  "Globe",
  "Server",
  "Zap",
  "Atom",
  "Cloud",
  "Box",
  "Network",
  "GitBranch",
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [categories, setCategories] = useState<SkillCategory[]>(initialSkillCategories);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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

  const handleSaveAll = async () => {
    setSaveStatus("saving");

    try {
      localStorage.setItem("portfolio_skills", JSON.stringify(skills));
      localStorage.setItem("portfolio_skill_categories", JSON.stringify(categories));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Local storage error:", err);
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveAllSkills",
          payload: { skills, categories },
        }),
      });

      if (!res.ok) throw new Error("Failed to save skills");
      setSaveStatus("saved");
      setStatusMessage("All technical skills saved successfully! Changes are live on your portfolio.");
      setTimeout(() => {
        setSaveStatus("idle");
        setStatusMessage("");
      }, 3500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setStatusMessage("Saved locally in browser. Could not sync with remote database.");
      setTimeout(() => {
        setSaveStatus("idle");
        setStatusMessage("");
      }, 4000);
    }
  };

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
      window.dispatchEvent(new Event("storage"));
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
      setIsModalOpen(false);
      setStatusMessage("Skill saved locally.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    try {
      localStorage.setItem("portfolio_skills", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
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
    const nextSkills = skills.map((item) => (item.id === s.id ? updated : item));
    setSkills(nextSkills);
    try {
      localStorage.setItem("portfolio_skills", JSON.stringify(nextSkills));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveSkill", payload: updated }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Save Changes & Add Skill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-400" />
            <span>Technical Skills Manager</span>
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Organize technologies across categories (Frontend, Backend, AI/ML, Database, Tools). Click <strong>Save Changes</strong> to publish updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saveStatus === "saving" ? "Saving..." : "Save Changes"}</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0d1f38] border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white font-bold text-sm tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            saveStatus === "error"
              ? "bg-rose-500/10 border-rose-400/40 text-rose-300"
              : "bg-emerald-500/10 border-emerald-400/40 text-emerald-300"
          }`}
        >
          {saveStatus === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
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
              className="bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-2xs p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{cat.name}</h3>
                </div>
                <span className="text-[11px] font-mono text-amber-300 bg-[#071324] px-2.5 py-1 rounded-full border border-amber-500/30">
                  {catSkills.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {catSkills.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      s.is_active
                        ? "bg-[#071324]/70 border-amber-500/40 shadow-xs"
                        : "bg-[#142c50]/40 border-amber-500/20 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-amber-300/80 font-mono">
                        Icon: {s.icon || "Code"}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(s)}
                        title={s.is_active ? "Deactivate" : "Activate"}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          s.is_active
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-[#071324] text-slate-400 border border-slate-700"
                        }`}
                      >
                        {s.is_active ? "Active" : "Off"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingSkill({ ...s });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-300 rounded hover:bg-amber-400/10 transition-colors cursor-pointer"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-400/10 transition-colors cursor-pointer"
                        title="Delete Skill"
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

      {/* Bottom Save Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-md">
        <div>
          <h4 className="text-sm font-bold text-white">Ready to apply changes?</h4>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Click <strong>Save Changes</strong> to write updates to local storage and sync with your database.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saveStatus === "saving"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saveStatus === "saving" ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#0d1f38] rounded-3xl border border-amber-500/40 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingSkill.id.startsWith("s-") ? "Add Skill" : "Edit Skill"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px]">
                  Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  placeholder="e.g. Next.js, PyTorch, Supabase..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px]">
                  Category *
                </label>
                <select
                  value={editingSkill.category_id}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, category_id: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white focus:outline-none focus:border-amber-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px]">
                  Icon Identifier
                </label>
                <input
                  type="text"
                  value={editingSkill.icon || "Code"}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, icon: e.target.value })
                  }
                  placeholder="Code, Cpu, Brain, Layers, Database..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white focus:outline-none focus:border-amber-400 mb-2"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {commonIcons.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setEditingSkill({ ...editingSkill, icon: ico })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        editingSkill.icon === ico
                          ? "bg-amber-400 text-[#071324] font-bold"
                          : "bg-[#071324] text-amber-300/80 border border-amber-500/30 hover:border-amber-400"
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-300 hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#071324] font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
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
