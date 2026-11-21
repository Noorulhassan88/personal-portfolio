"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Upload,
  User,
  Sliders,
  Sparkles,
} from "lucide-react";
import { HomepageSettings } from "@/types/portfolio";
import { initialHomepageSettings } from "@/data/initialData";

export default function AdminHomepageEditor() {
  const [settings, setSettings] = useState<HomepageSettings>(initialHomepageSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [photoError, setPhotoError] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    try {
      const localSettings = localStorage.getItem("portfolio_homepage_settings");
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } else {
        const directPhoto = localStorage.getItem("user_profile_photo");
        if (directPhoto) {
          setSettings((prev) => ({ ...prev, profile_photo_url: directPhoto }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPhotoError(false);
        const updated = {
          ...settings,
          profile_photo_url: data.url,
        };
        setSettings(updated);
        try {
          localStorage.setItem("user_profile_photo", data.url);
          localStorage.setItem("portfolio_homepage_settings", JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
        // Also sync with serverless backend
        fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateHomepage",
            payload: updated,
          }),
        }).catch(console.error);
      } else {
        alert(data.error || "Failed to upload photo");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");

    try {
      localStorage.setItem("portfolio_homepage_settings", JSON.stringify(settings));
      if (settings.profile_photo_url) {
        localStorage.setItem("user_profile_photo", settings.profile_photo_url);
      }
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateHomepage",
          payload: settings,
        }),
      });

      if (!res.ok) throw new Error("Failed to update homepage settings.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handlePositionChange = (axis: "x" | "y" | "scale", val: number) => {
    const prev = settings.profile_photo_position || { x: 50, y: 50, scale: 1 };
    setSettings({
      ...settings,
      profile_photo_position: {
        ...prev,
        [axis]: val,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Homepage & Hero Editor
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Configure your professional designation, hero copy, profile photo, and social links.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving Changes..." : "Publish Changes"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Homepage updated successfully! Live website will reflect changes immediately.</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>Failed to save changes. Please check server logs and retry.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Text and Link Configuration */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identity & Hero Details */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3">
              Hero Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                  Professional Designation
                </label>
                <input
                  type="text"
                  value={settings.designation}
                  onChange={(e) =>
                    setSettings({ ...settings, designation: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                Hero Intro Badge
              </label>
              <input
                type="text"
                value={settings.hero_intro}
                onChange={(e) =>
                  setSettings({ ...settings, hero_intro: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                Main Hero Heading
              </label>
              <input
                type="text"
                value={settings.hero_heading}
                onChange={(e) =>
                  setSettings({ ...settings, hero_heading: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                Professional Bio / Introduction
              </label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) =>
                  setSettings({ ...settings, description: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons Configuration */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3">
              Hero Call to Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={settings.button_explore_label}
                  onChange={(e) =>
                    setSettings({ ...settings, button_explore_label: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                  Primary Destination Link
                </label>
                <input
                  type="text"
                  value={settings.button_explore_link}
                  onChange={(e) =>
                    setSettings({ ...settings, button_explore_link: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  value={settings.button_about_label}
                  onChange={(e) =>
                    setSettings({ ...settings, button_about_label: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                  Secondary Destination Link
                </label>
                <input
                  type="text"
                  value={settings.button_about_link}
                  onChange={(e) =>
                    setSettings({ ...settings, button_about_link: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3">
              Social Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={settings.social_github}
                  onChange={(e) =>
                    setSettings({ ...settings, social_github: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={settings.social_linkedin}
                  onChange={(e) =>
                    setSettings({ ...settings, social_linkedin: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.social_email}
                  onChange={(e) =>
                    setSettings({ ...settings, social_email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Profile Photo & Cropping Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-2">
              Profile Photo Preview & Controls
            </h3>

            {/* Photo Box */}
            <div className="relative w-full h-72 rounded-xl overflow-hidden border border-amber-500/30 bg-[#142c50] flex items-center justify-center">
              {settings.profile_photo_url && !photoError ? (
                <Image
                  src={settings.profile_photo_url}
                  alt={settings.name}
                  fill
                  unoptimized={
                    settings.profile_photo_url.startsWith("data:") ||
                    settings.profile_photo_url.startsWith("http")
                  }
                  sizes="300px"
                  className="object-cover"
                  style={{
                    objectPosition: `${settings.profile_photo_position?.x ?? 50}% ${
                      settings.profile_photo_position?.y ?? 50
                    }%`,
                    transform: `scale(${settings.profile_photo_position?.scale ?? 1})`,
                  }}
                  onError={() => {
                    if (!settings.profile_photo_url.startsWith("data:")) {
                      setPhotoError(true);
                    }
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <User className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs text-amber-200/80">Placeholder Active</p>
                </div>
              )}
            </div>

            {/* Direct File Upload */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1.5">
                Upload Image File
              </label>
              <label className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#071324] text-xs font-extrabold transition-all shadow-md border border-amber-300">
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>{uploading ? "Uploading Image..." : "Choose Photo from Computer"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image URL Input */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">
                Or Image Source URL / Path
              </label>
              <input
                type="text"
                value={settings.profile_photo_url}
                onChange={(e) => {
                  setPhotoError(false);
                  setSettings({ ...settings, profile_photo_url: e.target.value });
                }}
                placeholder="https://... or /uploads/... or /profile.jpg"
                className="w-full px-3 py-2 rounded-xl border border-amber-500/30 text-xs"
              />
            </div>

            {/* Position and Scale Sliders */}
            <div className="space-y-3 pt-2 border-t border-amber-500/20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-300">Horizontal Alignment</span>
                <span className="font-mono text-amber-200/80">
                  {settings.profile_photo_position?.x ?? 50}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.profile_photo_position?.x ?? 50}
                onChange={(e) =>
                  handlePositionChange("x", parseInt(e.target.value, 10))
                }
                className="w-full accent-blue-600"
              />

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-300">Vertical Alignment</span>
                <span className="font-mono text-amber-200/80">
                  {settings.profile_photo_position?.y ?? 50}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.profile_photo_position?.y ?? 50}
                onChange={(e) =>
                  handlePositionChange("y", parseInt(e.target.value, 10))
                }
                className="w-full accent-blue-600"
              />

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-300">Zoom Scale</span>
                <span className="font-mono text-amber-200/80">
                  {settings.profile_photo_position?.scale ?? 1}x
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.05"
                value={settings.profile_photo_position?.scale ?? 1}
                onChange={(e) =>
                  handlePositionChange("scale", parseFloat(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
