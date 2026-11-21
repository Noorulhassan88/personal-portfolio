"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { AboutContent, EducationEntry } from "@/types/portfolio";
import { initialAboutContent } from "@/data/initialData";

export default function AdminAboutEditor() {
  const [content, setContent] = useState<AboutContent>(initialAboutContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateAbout",
          payload: content,
        }),
      });

      if (!res.ok) throw new Error("Failed to save About Me content.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...content.bio_paragraphs];
    updated[index] = val;
    setContent({ ...content, bio_paragraphs: updated });
  };

  const addParagraph = () => {
    setContent({
      ...content,
      bio_paragraphs: [...content.bio_paragraphs, ""],
    });
  };

  const removeParagraph = (index: number) => {
    setContent({
      ...content,
      bio_paragraphs: content.bio_paragraphs.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            About Me Content Editor
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your biography paragraphs, education credentials, philosophy, and specializations.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save About Content"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>About Me content updated successfully!</span>
        </div>
      )}

      {/* Biography Paragraphs */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-sm font-bold text-neutral-900">
            Professional Biography Paragraphs
          </h3>
          <button
            onClick={addParagraph}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="space-y-4">
          {content.bio_paragraphs.map((p, idx) => (
            <div key={idx} className="flex gap-3">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                placeholder={`Paragraph ${idx + 1}...`}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 resize-none"
              />
              <button
                onClick={() => removeParagraph(idx)}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors h-fit"
                title="Remove paragraph"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Education Credentials */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-neutral-900">
              Education History
            </h3>
          </div>
        </div>

        {content.education.map((edu, idx) => (
          <div
            key={edu.id}
            className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/40 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                  Degree Title
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...content.education];
                    updated[idx].degree = e.target.value;
                    setContent({ ...content, education: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...content.education];
                    updated[idx].institution = e.target.value;
                    setContent({ ...content, education: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                  Start Year
                </label>
                <input
                  type="text"
                  value={edu.start_year}
                  onChange={(e) => {
                    const updated = [...content.education];
                    updated[idx].start_year = e.target.value;
                    setContent({ ...content, education: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                  End Year
                </label>
                <input
                  type="text"
                  value={edu.end_year}
                  onChange={(e) => {
                    const updated = [...content.education];
                    updated[idx].end_year = e.target.value;
                    setContent({ ...content, education: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                  Grade / Honor
                </label>
                <input
                  type="text"
                  value={edu.grade || ""}
                  onChange={(e) => {
                    const updated = [...content.education];
                    updated[idx].grade = e.target.value;
                    setContent({ ...content, education: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Philosophy and Career Objectives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-neutral-900">
            Development Philosophy
          </h3>
          <textarea
            rows={4}
            value={content.development_philosophy}
            onChange={(e) =>
              setContent({ ...content, development_philosophy: e.target.value })
            }
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs resize-none"
          />
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-neutral-900">Career Objectives</h3>
          <textarea
            rows={4}
            value={content.career_objectives}
            onChange={(e) =>
              setContent({ ...content, career_objectives: e.target.value })
            }
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs resize-none"
          />
        </div>
      </div>
    </div>
  );
}
