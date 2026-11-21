"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { SeoSettings } from "@/types/portfolio";
import { initialSeoSettings } from "@/data/initialData";

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoSettings>(initialSeoSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_seo");
      if (local) {
        setSeo((prev) => ({ ...prev, ...JSON.parse(local) }));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=seo")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSeo((prev) => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem("portfolio_seo", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus("saving");

    try {
      localStorage.setItem("portfolio_seo", JSON.stringify(seo));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_seo_updated"));
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateSeo", payload: seo }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update SEO settings.");
      }

      if (resData.data) {
        setSeo(resData.data);
        try {
          localStorage.setItem("portfolio_seo", JSON.stringify(resData.data));
        } catch {}
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3500);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const updated = { ...seo, og_image_url: data.url };
        setSeo(updated);
        try {
          localStorage.setItem("portfolio_seo", JSON.stringify(updated));
        } catch {}
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handlePageMetaChange = (
    path: string,
    field: "title" | "description",
    val: string
  ) => {
    setSeo({
      ...seo,
      page_meta: {
        ...seo.page_meta,
        [path]: {
          ...seo.page_meta[path],
          [field]: val,
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-amber-400" />
            <span>Search Engine Optimization (SEO) & Social Graph</span>
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Configure global meta tags, Open Graph images for LinkedIn/Twitter, and page-level SEO titles. Click <strong>Save SEO Settings</strong> to publish.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>SEO settings updated and synchronized across all pages successfully!</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-400/40 text-rose-300 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>Failed to sync with cloud database. Stored in local browser cache.</span>
        </div>
      )}

      {/* Global Meta */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3 flex items-center gap-2 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Global Search Engine & Social Graph Defaults</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Global Site Title *
              </label>
              <input
                type="text"
                required
                value={seo.global_title}
                onChange={(e) => setSeo({ ...seo, global_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Global Meta Description *
              </label>
              <textarea
                rows={3}
                required
                value={seo.global_description}
                onChange={(e) => setSeo({ ...seo, global_description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white resize-none focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>

          <div className="space-y-3 bg-[#071324]/50 p-4 rounded-2xl border border-amber-500/20">
            <label className="block text-xs font-semibold text-amber-300 uppercase">
              Social Sharing Card Preview (OG:Image)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-[#071324] border border-amber-500/40 shrink-0 shadow-inner">
                {seo.og_image_url ? (
                  <Image
                    src={seo.og_image_url}
                    alt="Social Preview"
                    fill
                    unoptimized={seo.og_image_url.startsWith("http") || seo.og_image_url.startsWith("data:")}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px]">
                    <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                    <span>No Preview</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOgUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={seo.og_image_url}
                  onChange={(e) => setSeo({ ...seo, og_image_url: e.target.value })}
                  placeholder="/profile.png or https://..."
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#071324] text-[11px] text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Specific Meta */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3 uppercase tracking-wider">
          Page-Specific Metadata Overrides
        </h3>

        <div className="space-y-4">
          {Object.entries(seo.page_meta).map(([route, meta]) => (
            <div
              key={route}
              className="p-5 rounded-xl border border-amber-500/30 bg-[#071324]/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-amber-400 bg-[#0d1f38] px-3 py-1 rounded-full border border-amber-500/30">
                  Route: {route}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-1">
                    Browser Tab / Page Title
                  </label>
                  <input
                    type="text"
                    value={meta.title}
                    onChange={(e) =>
                      handlePageMetaChange(route, "title", e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-300 uppercase mb-1">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={meta.description}
                    onChange={(e) =>
                      handlePageMetaChange(route, "description", e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 bg-[#0d1f38] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-md">
        <div>
          <h4 className="text-sm font-bold text-white">Save All SEO Changes</h4>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Click <strong>Save SEO Settings</strong> to write metadata to cloud database and refresh page titles.
          </p>
        </div>
        <button
          onClick={() => handleSave()}
          disabled={status === "saving"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>
    </div>
  );
}
