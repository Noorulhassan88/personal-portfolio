"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  GraduationCap,
  X,
  Layers,
  Cpu,
  Binary,
  Database,
  Brain,
  Terminal,
  Code,
  Sparkles,
  Tag,
  BookOpen,
} from "lucide-react";
import { AboutContent, EducationEntry } from "@/types/portfolio";
import { initialAboutContent } from "@/data/initialData";

const availableIcons = [
  "Layers",
  "Cpu",
  "Binary",
  "Database",
  "Brain",
  "Terminal",
  "Code",
  "Sparkles",
];

export default function AdminAboutEditor() {
  const [content, setContent] = useState<AboutContent>(initialAboutContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_about");
      if (local) {
        setContent((prev) => ({ ...prev, ...JSON.parse(local) }));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=about")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setContent((prev) => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem("portfolio_about", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      localStorage.setItem("portfolio_about", JSON.stringify(content));
    } catch (err) {
      console.error(err);
    }

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

  // Specialization helpers
  const addSpecialization = () => {
    const newSpec = {
      title: "New Specialization",
      description: "Describe this area of technical specialization.",
      icon: "Sparkles",
    };
    setContent({
      ...content,
      areas_of_specialization: [...content.areas_of_specialization, newSpec],
    });
  };

  const updateSpecialization = (
    index: number,
    field: "title" | "description" | "icon",
    val: string
  ) => {
    const updated = [...content.areas_of_specialization];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, areas_of_specialization: updated });
  };

  const removeSpecialization = (index: number) => {
    setContent({
      ...content,
      areas_of_specialization: content.areas_of_specialization.filter((_, i) => i !== index),
    });
  };

  // Interests helpers
  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newInterest.trim();
    if (!trimmed) return;
    if (content.technical_interests.includes(trimmed)) {
      setNewInterest("");
      return;
    }
    setContent({
      ...content,
      technical_interests: [...content.technical_interests, trimmed],
    });
    setNewInterest("");
  };

  const handleRemoveInterest = (item: string) => {
    setContent({
      ...content,
      technical_interests: content.technical_interests.filter((i) => i !== item),
    });
  };

  // Biography helpers
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
    <div className="space-y-8 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            About Me Content Editor
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Customize the header text, photo, biography, education, areas of specialization, and core interests.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs disabled:opacity-70 cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save About Content"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>About Me content saved successfully!</span>
        </div>
      )}

      {/* 1. Header & Banner Text Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Page Header & Subtitle Text
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-amber-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Page Main Heading
            </label>
            <input
              type="text"
              value={content.header_title || ""}
              onChange={(e) => setContent({ ...content, header_title: e.target.value })}
              placeholder="e.g. Bridging Artificial Intelligence with Modern Web Architecture."
              className="w-full px-4 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white text-sm font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-amber-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Header Description Subtitle
            </label>
            <textarea
              rows={2}
              value={content.header_description || ""}
              onChange={(e) => setContent({ ...content, header_description: e.target.value })}
              placeholder="e.g. Discover my background, education, and technical expertise in building scalable software systems and applied AI."
              className="w-full px-4 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-white text-xs resize-none focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 2. Areas of Specialization */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Areas of Specialization ({content.areas_of_specialization.length})
            </h3>
          </div>
          <button
            onClick={addSpecialization}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Specialization</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.areas_of_specialization.map((spec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-amber-500/30 bg-[#071324]/50 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-300 font-bold">
                  Card #{idx + 1}
                </span>
                <button
                  onClick={() => removeSpecialization(idx)}
                  className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remove specialization"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-amber-300/80 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={spec.title}
                  onChange={(e) => updateSpecialization(idx, "title", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#0d1f38] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-amber-300/80 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={spec.description}
                  onChange={(e) => updateSpecialization(idx, "description", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#0d1f38] text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-amber-300/80 mb-1">
                  Icon
                </label>
                <select
                  value={spec.icon}
                  onChange={(e) => updateSpecialization(idx, "icon", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#0d1f38] text-xs text-white"
                >
                  {availableIcons.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Core Technical Interests */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
          <Tag className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Core Technical Interests ({content.technical_interests.length})
          </h3>
        </div>

        {/* Existing Tags Cloud with Delete Pill */}
        <div className="flex flex-wrap gap-2">
          {content.technical_interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071324] border border-amber-400/50 text-amber-300 text-xs font-semibold shadow-xs"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(interest)}
                className="hover:text-red-400 cursor-pointer ml-0.5"
                title={`Remove ${interest}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Add New Interest Form */}
        <form onSubmit={handleAddInterest} className="flex gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add new technical interest (e.g. Distributed Systems)..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 text-[#071324] font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>

      {/* 5. Professional Biography Paragraphs */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Professional Biography Paragraphs
            </h3>
          </div>
          <button
            onClick={addParagraph}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
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
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />
              <button
                onClick={() => removeParagraph(idx)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors h-fit cursor-pointer"
                title="Remove paragraph"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Education Credentials */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Academic Credentials & Education
          </h3>
        </div>

        {content.education.map((edu, idx) => (
          <div
            key={edu.id}
            className="p-5 rounded-xl border border-amber-500/30 bg-[#071324]/40 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-xs text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
