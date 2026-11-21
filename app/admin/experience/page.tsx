"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Calendar,
  MapPin,
  X,
  Save,
  Tag,
  ListPlus,
} from "lucide-react";
import { ExperienceEntry } from "@/types/portfolio";
import { initialExperience } from "@/data/initialData";
import { formatDate } from "@/lib/utils";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<ExperienceEntry[]>(initialExperience);
  const [editingEntry, setEditingEntry] = useState<ExperienceEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newTech, setNewTech] = useState("");

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_experience");
      if (local) {
        setExperience(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=experience")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setExperience(res.data);
          try {
            localStorage.setItem("portfolio_experience", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveAll = async () => {
    setSaveStatus("saving");

    try {
      localStorage.setItem("portfolio_experience", JSON.stringify(experience));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_experience_updated"));
    } catch (err) {
      console.error("Local storage error:", err);
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveAllExperience",
          payload: experience,
        }),
      });

      if (!res.ok) throw new Error("Failed to save experience entries");
      setSaveStatus("saved");
      setStatusMessage("All experience entries saved successfully! Changes are live on your portfolio.");
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
    const newEntry: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      organization: "",
      designation: "",
      type: "Internship",
      location: "Chennai, India",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: "Present",
      is_current: true,
      responsibilities: ["Engineered full-stack features and machine learning models."],
      technologies: ["Next.js", "Python"],
      sort_order: experience.length + 1,
    };
    setEditingEntry(newEntry);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    // Filter out any empty responsibilities or technologies
    const cleanedEntry: ExperienceEntry = {
      ...editingEntry,
      location: editingEntry.location?.trim() || "Remote",
      responsibilities: editingEntry.responsibilities
        .map((r) => r.trim())
        .filter(Boolean),
      technologies: editingEntry.technologies
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const exists = experience.some((item) => item.id === cleanedEntry.id);
    const updated = exists
      ? experience.map((item) => (item.id === cleanedEntry.id ? cleanedEntry : item))
      : [...experience, cleanedEntry];

    setExperience(updated);
    try {
      localStorage.setItem("portfolio_experience", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_experience_updated"));
    } catch (err) {
      console.error(err);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveExperience", payload: cleanedEntry }),
      });

      setIsModalOpen(false);
      setStatusMessage("Experience entry saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setIsModalOpen(false);
      setStatusMessage("Saved locally in browser.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    const updated = experience.filter((e) => e.id !== id);
    setExperience(updated);
    try {
      localStorage.setItem("portfolio_experience", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_experience_updated"));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteExperience", payload: { id } }),
      });
      setStatusMessage("Entry removed.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Responsibility helpers
  const handleAddResponsibility = () => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      responsibilities: [
        ...editingEntry.responsibilities,
        "Describe your key achievement or technical responsibility.",
      ],
    });
  };

  const handleUpdateResponsibility = (index: number, val: string) => {
    if (!editingEntry) return;
    const updated = [...editingEntry.responsibilities];
    updated[index] = val;
    setEditingEntry({ ...editingEntry, responsibilities: updated });
  };

  const handleRemoveResponsibility = (index: number) => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      responsibilities: editingEntry.responsibilities.filter((_, i) => i !== index),
    });
  };

  // Technology tag helpers
  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !newTech.trim()) return;
    const tag = newTech.trim();
    if (!editingEntry.technologies.includes(tag)) {
      setEditingEntry({
        ...editingEntry,
        technologies: [...editingEntry.technologies, tag],
      });
    }
    setNewTech("");
  };

  const handleRemoveTech = (tag: string) => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      technologies: editingEntry.technologies.filter((t) => t !== tag),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            <span>Experience & Timeline Manager</span>
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Manage your positions, company name, location, role descriptions, and technical stacks. Click <strong>Save Changes</strong> to publish.
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
            <span>Add Experience</span>
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

      {/* Experience List Cards */}
      <div className="space-y-4">
        {experience.map((entry) => (
          <div
            key={entry.id}
            className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#142c50] text-amber-300 border border-amber-400/40">
                    {entry.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-200/80 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {formatDate(entry.start_date)} –{" "}
                      {entry.is_current ? "Present" : formatDate(entry.end_date)}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {entry.designation}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-amber-300 font-semibold mt-1">
                  <span className="flex items-center gap-1 text-white">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    {entry.organization}
                  </span>
                  {entry.location && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {entry.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start">
                <button
                  onClick={() => {
                    setEditingEntry({ ...entry });
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                  title="Edit Experience"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Responsibilities list preview */}
            {entry.responsibilities && entry.responsibilities.length > 0 && (
              <ul className="space-y-1.5 pt-2 border-t border-amber-500/20">
                {entry.responsibilities.map((resp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Technologies tags preview */}
            {entry.technologies && entry.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {entry.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#071324] text-amber-300 border border-amber-500/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-md">
        <div>
          <h4 className="text-sm font-bold text-white">Save All Experience Updates</h4>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Click <strong>Save Changes</strong> to commit all entries to your database and update the live timeline.
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

      {/* Edit / Add Modal */}
      {isModalOpen && editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#0d1f38] rounded-3xl border border-amber-500/40 shadow-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>
                  {editingEntry.id.startsWith("exp-")
                    ? "Add Experience Entry"
                    : "Edit Experience Entry"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-5 text-xs">
              {/* Designation & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px]">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.designation}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, designation: e.target.value })
                    }
                    placeholder="e.g. AI & Full Stack Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px]">
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.organization}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, organization: e.target.value })
                    }
                    placeholder="e.g. Company Name / Institute"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Location & Experience Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={editingEntry.location || ""}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, location: e.target.value })
                    }
                    placeholder="e.g. Chennai, India or Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-amber-300 mb-1 uppercase tracking-wider text-[11px]">
                    Position Type
                  </label>
                  <select
                    value={editingEntry.type}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        type: e.target.value as ExperienceEntry["type"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Work Experience">Work Experience</option>
                    <option value="Technical Training">Technical Training</option>
                    <option value="Professional Contribution">
                      Professional Contribution
                    </option>
                  </select>
                </div>
              </div>

              {/* Timeline Dates & Current Role Toggle */}
              <div className="p-4 rounded-xl bg-[#071324]/60 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_current"
                    checked={editingEntry.is_current}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        is_current: e.target.checked,
                        end_date: e.target.checked ? "Present" : editingEntry.end_date === "Present" ? "" : editingEntry.end_date,
                      })
                    }
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <label htmlFor="is_current" className="text-xs font-semibold text-white cursor-pointer">
                    I currently work in this role / position
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-amber-300 mb-1 text-[11px]">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={editingEntry.start_date}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, start_date: e.target.value })
                      }
                      placeholder="e.g. 2024-01-01 or Jan 2024"
                      className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-amber-300 mb-1 text-[11px]">
                      End Date
                    </label>
                    <input
                      type="text"
                      disabled={editingEntry.is_current}
                      value={editingEntry.is_current ? "Present" : editingEntry.end_date}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, end_date: e.target.value })
                      }
                      placeholder="e.g. 2024-12-31 or Present"
                      className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-white focus:outline-none focus:border-amber-400 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Responsibilities / Descriptions List Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ListPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Descriptions & Key Achievements ({editingEntry.responsibilities.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Point</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {editingEntry.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[11px] font-mono text-amber-400 font-bold mt-2 shrink-0">
                        #{idx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={resp}
                        onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                        placeholder={`Description / achievement #${idx + 1}...`}
                        className="flex-1 px-3 py-2 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer mt-1"
                        title="Remove Point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Tag Editor */}
              <div className="space-y-2 pt-2 border-t border-amber-500/20">
                <label className="block font-semibold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Technologies Used ({editingEntry.technologies.length})</span>
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {editingEntry.technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#071324] border border-amber-500/40 text-amber-300 text-xs font-mono"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1 max-w-sm">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech(e);
                      }
                    }}
                    placeholder="Add technology (e.g. Next.js, PyTorch)..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
