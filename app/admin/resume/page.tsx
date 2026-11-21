"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Save,
  ExternalLink,
} from "lucide-react";
import { initialHomepageSettings } from "@/data/initialData";

export default function AdminResumePage() {
  const [resumeUrl, setResumeUrl] = useState(initialHomepageSettings.resume_url);
  const [resumeEnabled, setResumeEnabled] = useState(
    initialHomepageSettings.resume_enabled
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("noorul-hassan-resume.pdf");

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_homepage_settings");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.resume_url) setResumeUrl(parsed.resume_url);
        if (parsed.resume_enabled !== undefined) setResumeEnabled(parsed.resume_enabled);
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=homepage")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.resume_url) setResumeUrl(res.data.resume_url);
          if (res.data.resume_enabled !== undefined) setResumeEnabled(res.data.resume_enabled);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus("saving");

    try {
      const existing = localStorage.getItem("portfolio_homepage_settings");
      const parsed = existing ? JSON.parse(existing) : initialHomepageSettings;
      const updated = {
        ...parsed,
        resume_url: resumeUrl,
        resume_enabled: resumeEnabled,
      };
      localStorage.setItem("portfolio_homepage_settings", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateHomepage",
          payload: {
            resume_url: resumeUrl,
            resume_enabled: resumeEnabled,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to save resume settings.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setResumeUrl(data.url);
        try {
          const existing = localStorage.getItem("portfolio_homepage_settings");
          const parsed = existing ? JSON.parse(existing) : initialHomepageSettings;
          const updated = {
            ...parsed,
            resume_url: data.url,
            resume_enabled: resumeEnabled,
          };
          localStorage.setItem("portfolio_homepage_settings", JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }

        // Also save to database
        fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateHomepage",
            payload: { resume_url: data.url, resume_enabled: resumeEnabled },
          }),
        }).catch(console.error);

        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        alert(data.error || "Failed to upload PDF resume");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload PDF resume");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Resume & Document Manager
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Upload your latest PDF resume, manage download permissions, and configure dynamic links.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save Resume Settings"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Resume settings updated! Every download button across the public website now targets the updated resume.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Configuration & Upload */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3">
              Resume File Source
            </h3>

            {/* Upload Box */}
            <div className="p-8 border-2 border-dashed border-amber-500/30 hover:border-blue-500 rounded-2xl bg-[#071324]/50 hover:bg-blue-50/30 transition-all text-center flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-blue-600 mb-3" />
              <div className="text-sm font-semibold text-slate-100 mb-1">
                Upload New Resume (PDF)
              </div>
              <p className="text-xs text-amber-200/80 mb-4">
                Supported format: PDF up to 10MB
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d1f38] border border-amber-500/40 hover:bg-[#071324] text-xs font-semibold text-slate-100 shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? "Uploading PDF..." : "Select PDF File"}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <div className="mt-3 text-[11px] font-mono text-amber-200/80">
                Current active file: <span className="font-bold text-slate-100">{uploadedFileName}</span>
              </div>
            </div>

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Or Direct PDF Document URL
              </label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="/resume.pdf or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 text-xs text-white"
              />
            </div>

            {/* Toggle public download */}
            <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">
                  Enable Public Resume Download
                </h4>
                <p className="text-[11px] text-amber-200/80">
                  Controls whether the &quot;Download Resume&quot; button appears in the hero and navigation.
                </p>
              </div>

              <input
                type="checkbox"
                checked={resumeEnabled}
                onChange={(e) => setResumeEnabled(e.target.checked)}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Download Test */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-2">
              Action Test
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Verify that the published resume link is accessible and loads properly:
            </p>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 text-[#071324] font-extrabold text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Test Download Resume Link</span>
            </a>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-800 space-y-1">
              <span className="font-bold">Dynamic Sync Active:</span>
              <p>
                When updated, all homepage CTA buttons and navigation elements will instantly deliver the latest resume.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
