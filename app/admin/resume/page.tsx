"use client";

import React, { useState } from "react";
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
  const [uploadedFileName, setUploadedFileName] = useState("noorul-hassan-resume.pdf");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");

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

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setResumeUrl(`/uploads/${file.name}`);
      alert(`File "${file.name}" selected. Click "Save Resume Settings" to publish.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Resume & Document Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Upload your latest PDF resume, manage download permissions, and configure dynamic links.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs disabled:opacity-70"
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
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Resume File Source
            </h3>

            {/* Upload Box */}
            <div className="p-8 border-2 border-dashed border-neutral-200 hover:border-blue-500 rounded-2xl bg-neutral-50/50 hover:bg-blue-50/30 transition-all text-center flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-blue-600 mb-3" />
              <div className="text-sm font-semibold text-neutral-800 mb-1">
                Upload New Resume (PDF)
              </div>
              <p className="text-xs text-neutral-500 mb-4">
                Supported format: PDF up to 10MB
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Select PDF File</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>
              <div className="mt-3 text-[11px] font-mono text-neutral-500">
                Current active file: <span className="font-bold text-neutral-800">{uploadedFileName}</span>
              </div>
            </div>

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Or Direct PDF Document URL
              </label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="/resume.pdf or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900"
              />
            </div>

            {/* Toggle public download */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">
                  Enable Public Resume Download
                </h4>
                <p className="text-[11px] text-neutral-500">
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
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              Action Test
            </h3>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Verify that the published resume link is accessible and loads properly:
            </p>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
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
