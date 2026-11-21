"use client";

import React, { useState } from "react";
import { Palette, CheckCircle2, Save, Layout, Type } from "lucide-react";
import { AppearanceSettings } from "@/types/portfolio";
import { initialAppearanceSettings } from "@/data/initialData";

const accentPresets = [
  { name: "blue", label: "Subtle Blue", color: "#2563eb" },
  { name: "indigo", label: "Deep Indigo", color: "#4f46e5" },
  { name: "emerald", label: "Emerald Mint", color: "#059669" },
  { name: "violet", label: "Royal Violet", color: "#7c3aed" },
  { name: "slate", label: "Monochrome Slate", color: "#334155" },
  { name: "amber", label: "Warm Amber", color: "#d97706" },
];

export default function AdminAppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings>(
    initialAppearanceSettings
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateAppearance", payload: settings }),
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Appearance & Visual Identity
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Fine-tune primary accent hues, typography scales, navbar styling, and footer branding.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Apply Appearance"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Appearance settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Controls */}
        <div className="lg:col-span-8 space-y-6">
          {/* Accent Color Palette */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Primary Accent Color
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {accentPresets.map((preset) => {
                const isSelected = settings.accent_name === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        accent_color: preset.color,
                        accent_name: preset.name as AppearanceSettings["accent_name"],
                      })
                    }
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full shadow-2xs"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="text-xs font-semibold text-neutral-800">
                        {preset.label}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background & Typography Presets */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Theme Layout Presets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                  Background Style
                </label>
                <select
                  value={settings.bg_preset}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bg_preset: e.target.value as AppearanceSettings["bg_preset"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-900"
                >
                  <option value="clean-white">Minimal Clean White (#fafafa)</option>
                  <option value="warm-white">Warm Editorial Off-White (#fcfbf9)</option>
                  <option value="soft-zinc">Soft Zinc Slate (#f8fafc)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                  Typography Preset
                </label>
                <select
                  value={settings.font_preset}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      font_preset: e.target.value as AppearanceSettings["font_preset"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-900"
                >
                  <option value="modern-sans">Modern Clean Sans-Serif</option>
                  <option value="editorial">Editorial Minimalist</option>
                  <option value="technical">Technical Developer Monospace Blend</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                Website Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footer_text}
                onChange={(e) =>
                  setSettings({ ...settings, footer_text: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Preview Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              Live Swatch Preview
            </h3>

            <div className="p-5 rounded-2xl bg-[#fafafa] border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: settings.accent_color }}
                >
                  NH
                </span>
                <span className="font-bold text-xs text-neutral-900">
                  {settings.logo_text}
                </span>
              </div>

              <div className="text-xs text-neutral-600">
                Sample interactive button preview:
              </div>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs"
                style={{ backgroundColor: settings.accent_color }}
              >
                Sample Action Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
