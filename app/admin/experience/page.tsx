"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Briefcase, Calendar, X, Save } from "lucide-react";
import { ExperienceEntry } from "@/types/portfolio";
import { initialExperience } from "@/data/initialData";
import { formatDate } from "@/lib/utils";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<ExperienceEntry[]>(initialExperience);
  const [editingEntry, setEditingEntry] = useState<ExperienceEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveExperience", payload: editingEntry }),
      });

      const exists = experience.some((e) => e.id === editingEntry.id);
      if (exists) {
        setExperience(
          experience.map((e) => (e.id === editingEntry.id ? editingEntry : e))
        );
      } else {
        setExperience([...experience, editingEntry]);
      }

      setIsModalOpen(false);
      setStatusMessage("Experience saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save experience.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteExperience", payload: { id } }),
      });
      setExperience(experience.filter((e) => e.id !== id));
      setStatusMessage("Entry removed.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Experience & Timeline Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your internships, engineering positions, and research contributions.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {experience.map((entry) => (
          <div
            key={entry.id}
            className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {entry.type}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {formatDate(entry.start_date)} –{" "}
                  {entry.is_current ? "Present" : formatDate(entry.end_date)}
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900">
                {entry.designation}
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                {entry.organization} {entry.location && `• ${entry.location}`}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  setEditingEntry({ ...entry });
                  setIsModalOpen(true);
                }}
                className="p-2 rounded-xl text-neutral-400 hover:text-blue-600 hover:bg-neutral-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-neutral-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingEntry.id.startsWith("exp-") ? "Add Experience" : "Edit Experience"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.designation}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, designation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.organization}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, organization: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Type</label>
                  <select
                    value={editingEntry.type}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        type: e.target.value as ExperienceEntry["type"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Work Experience">Work Experience</option>
                    <option value="Technical Training">Technical Training</option>
                    <option value="Professional Contribution">
                      Professional Contribution
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={editingEntry.start_date}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, start_date: e.target.value })
                    }
                    placeholder="YYYY-MM-DD"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={editingEntry.end_date}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, end_date: e.target.value })
                    }
                    placeholder="YYYY-MM-DD or Present"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                  />
                </div>
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
