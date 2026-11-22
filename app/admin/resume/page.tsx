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
  Loader2,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { initialHomepageSettings } from "@/data/initialData";

export default function AdminResumePage() {
  const [resumeUrl, setResumeUrl] = useState(initialHomepageSettings.resume_url);
  const [resumeEnabled, setResumeEnabled] = useState(
    initialHomepageSettings.resume_enabled
  );
  const [buttonLabel, setButtonLabel] = useState(
    initialHomepageSettings.button_resume_label || "Download Resume"
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("Noorul_Hassan_Resume.pdf");
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_homepage_settings");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.resume_url) {
          setResumeUrl(parsed.resume_url);
          const fname = parsed.resume_url.split("/").pop();
          if (fname && !parsed.resume_url.startsWith("data:")) {
            setUploadedFileName(fname);
          }
        }
        if (parsed.resume_enabled !== undefined) setResumeEnabled(parsed.resume_enabled);
        if (parsed.button_resume_label) setButtonLabel(parsed.button_resume_label);
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=homepage")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.resume_url) {
            setResumeUrl(res.data.resume_url);
            const fname = res.data.resume_url.split("/").pop();
            if (fname && !res.data.resume_url.startsWith("data:")) {
              setUploadedFileName(fname);
            }
          }
          if (res.data.resume_enabled !== undefined) setResumeEnabled(res.data.resume_enabled);
          if (res.data.button_resume_label) setButtonLabel(res.data.button_resume_label);
          setPreviewKey((k) => k + 1);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus("saving");
    setStatusMessage("");

    const targetUrl = resumeUrl.trim() || "/resume.pdf";

    // 1. Immediately update localStorage for instant reactive reflection in UI
    try {
      const existing = localStorage.getItem("portfolio_homepage_settings");
      const parsed = existing ? JSON.parse(existing) : initialHomepageSettings;
      const updated = {
        ...parsed,
        resume_url: targetUrl,
        resume_enabled: resumeEnabled,
        button_resume_label: buttonLabel,
      };
      localStorage.setItem("portfolio_homepage_settings", JSON.stringify(updated));
      localStorage.setItem("portfolio_resume_url", targetUrl);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_homepage_updated"));
      window.dispatchEvent(new CustomEvent("portfolio_resume_updated"));
    } catch (err) {
      console.error("Failed saving to localStorage:", err);
    }

    // 2. Persist to API & Supabase database
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateHomepage",
          payload: {
            id: "default-homepage",
            resume_url: targetUrl,
            resume_enabled: resumeEnabled,
            button_resume_label: buttonLabel,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to save resume settings.");
      setStatus("saved");
      setStatusMessage("Resume settings successfully saved and live across the website!");
      setPreviewKey((k) => k + 1);
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 4000);
    } catch (err) {
      console.error("Save error:", err);
      setStatus("error");
      setStatusMessage("Saved to local session. Cloud database sync failed.");
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 4000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      alert("Please select a valid PDF file (.pdf)");
      return;
    }

    setUploading(true);
    setUploadedFileName(file.name);
    setStatus("saving");
    setStatusMessage(`Uploading ${file.name}...`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const newUrl = data.url;
        setResumeUrl(newUrl);

        // Update local storage
        try {
          const existing = localStorage.getItem("portfolio_homepage_settings");
          const parsed = existing ? JSON.parse(existing) : initialHomepageSettings;
          const updated = {
            ...parsed,
            resume_url: newUrl,
            resume_enabled: resumeEnabled,
            button_resume_label: buttonLabel,
          };
          localStorage.setItem("portfolio_homepage_settings", JSON.stringify(updated));
          localStorage.setItem("portfolio_resume_url", newUrl);
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("portfolio_homepage_updated"));
          window.dispatchEvent(new CustomEvent("portfolio_resume_updated"));
        } catch (err) {
          console.error(err);
        }

        // Commit to database
        const saveRes = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateHomepage",
            payload: {
              id: "default-homepage",
              resume_url: newUrl,
              resume_enabled: resumeEnabled,
              button_resume_label: buttonLabel,
            },
          }),
        });

        if (saveRes.ok) {
          setStatus("saved");
          setStatusMessage(`Resume "${file.name}" uploaded and synchronized across the website!`);
        } else {
          setStatus("saved");
          setStatusMessage(`Resume "${file.name}" uploaded and saved locally.`);
        }
        setPreviewKey((k) => k + 1);
        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Failed to upload PDF resume");
        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Failed to upload PDF resume");
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 4000);
    } finally {
      setUploading(false);
    }
  };

  const getSourceBadge = () => {
    if (!resumeUrl) return "No URL Configured";
    if (resumeUrl.startsWith("data:application/pdf")) return "Base64 Binary Document";
    if (resumeUrl.startsWith("/uploads/")) return "Uploaded Server PDF";
    if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://"))
      return "External Cloud Link";
    return "Local Static Asset (/resume.pdf)";
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Resume & Document Manager
            </h1>
            <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1">
            Upload your latest PDF resume, manage download permissions, and verify live dynamic delivery.
          </p>
        </div>

        {/* Top Header Save Changes Button */}
        <button
          onClick={() => handleSave()}
          disabled={status === "saving" || uploading}
          className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all cursor-pointer disabled:opacity-50"
        >
          {status === "saving" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#071324]" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Status Notifications */}
      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {statusMessage ||
              "Resume updated! Every 'Download Resume' button across the public website now serves the updated resume instantly."}
          </span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{statusMessage || "An error occurred while saving resume settings."}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Upload & Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Resume Document Source</span>
              </h3>
              <span className="text-[11px] font-mono text-amber-300/80 bg-[#071324] px-2.5 py-1 rounded-lg border border-amber-500/20">
                {getSourceBadge()}
              </span>
            </div>

            {/* Upload Box */}
            <div className="p-8 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl bg-[#071324]/60 hover:bg-[#071324]/90 transition-all text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-3 text-amber-400">
                {uploading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <FileText className="w-7 h-7" />
                )}
              </div>

              <div className="text-base font-bold text-white mb-1">
                Upload New Resume (PDF)
              </div>
              <p className="text-xs text-amber-200/80 mb-5 max-w-sm">
                Upload your updated CV in PDF format. It will be streamed directly to all visitors when they click download.
              </p>

              <label className="cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>{uploading ? "Uploading & Processing..." : "Select New PDF Resume"}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <div className="mt-4 text-[11px] font-mono text-amber-200/70 flex items-center gap-2 bg-[#0d1f38] px-3 py-1.5 rounded-lg border border-amber-500/20">
                <span>Active document:</span>
                <span className="font-bold text-amber-300 truncate max-w-[200px] sm:max-w-[280px]">
                  {uploadedFileName}
                </span>
              </div>
            </div>

            {/* Direct URL / Path Override */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wide">
                Direct PDF Document URL or Local Path
              </label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="/resume.pdf, /uploads/resume.pdf, or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[11px] text-amber-200/60">
                Leave as <code className="text-amber-300 font-bold">/resume.pdf</code> or an uploaded path. Visitors always access it through the safe streaming route.
              </p>
            </div>

            {/* Button Label Override */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wide">
                Hero Button Display Label
              </label>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                placeholder="Download Resume"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Toggle public download */}
            <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">
                  Enable Public Resume Download
                </h4>
                <p className="text-[11px] text-amber-200/70">
                  Controls whether the &quot;{buttonLabel}&quot; CTA button is visible on the public hero section.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={resumeEnabled}
                  onChange={(e) => setResumeEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Action Test & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Live Action Test & Preview</span>
              </h3>
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="p-1 rounded-lg text-amber-300 hover:text-white hover:bg-[#142c50] transition-colors"
                title="Refresh preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Verify that the streaming route serves your PDF cleanly in the browser without security or data URL blocks:
            </p>

            {/* Test Link Action 1: Dedicated streaming endpoint */}
            <div className="space-y-3">
              <a
                href={`/api/resume?v=${previewKey}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                <span>Open Resume in New Tab (/api/resume)</span>
              </a>

              <a
                href={`/api/resume?download=1&v=${previewKey}`}
                download="Noorul_Hassan_Resume.pdf"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#071324] hover:bg-[#142c50] text-amber-300 border border-amber-400/50 font-bold text-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Direct Download Test</span>
              </a>
            </div>

            {/* Embedded Live PDF Frame */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-2">
                Live Document Embed Viewer
              </label>
              <div className="rounded-xl overflow-hidden border border-amber-500/30 bg-[#071324] h-[280px] sm:h-[320px] relative">
                <iframe
                  key={previewKey}
                  src={`/api/resume?preview=1&v=${previewKey}#toolbar=0`}
                  className="w-full h-full border-0"
                  title="Live Resume Document Preview"
                />
              </div>
            </div>

            {/* Architecture Explainer Badge */}
            <div className="p-4 rounded-xl bg-[#071324]/80 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Safe Streaming Engine Active</span>
              </div>
              <p className="leading-relaxed text-slate-300">
                Browsers block top-frame data URLs. Our Next.js streaming endpoint (<code className="text-amber-300 font-mono">/api/resume</code>) decodes your binary and serves compliant PDF headers (<code className="text-amber-300 font-mono">inline</code>) directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Save Bar - Always Visible */}
      <div className="sticky bottom-4 z-40 bg-[#0d1f38]/95 backdrop-blur-md p-4 rounded-2xl border-2 border-amber-400/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <div>
            <p className="text-xs font-bold text-white tracking-wide">
              Active Resume: <span className="text-amber-300 font-mono">{uploadedFileName}</span> ({resumeEnabled ? "Public Download Active" : "Download Disabled"})
            </p>
            <p className="text-[11px] text-amber-200/70">
              Click &quot;Save Changes&quot; to commit resume settings and sync with live portfolio.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={status === "saving" || uploading}
          className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] tracking-wide transition-all cursor-pointer disabled:opacity-50"
        >
          {status === "saving" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#071324]" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
