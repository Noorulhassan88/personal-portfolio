"use client";

import React, { useState } from "react";
import { Search, Save, CheckCircle2, Globe } from "lucide-react";
import { SeoSettings } from "@/types/portfolio";
import { initialSeoSettings } from "@/data/initialData";

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoSettings>(initialSeoSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateSeo", payload: seo }),
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
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
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Search Engine Optimization (SEO) & Social Graph
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Configure global meta tags, Open Graph images for LinkedIn/Twitter, and page-level SEO titles.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>SEO settings updated successfully!</span>
        </div>
      )}

      {/* Global Meta */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
        <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>Global Search Engine Defaults</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
              Global Site Title *
            </label>
            <input
              type="text"
              required
              value={seo.global_title}
              onChange={(e) => setSeo({ ...seo, global_title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
              Social Sharing Image (OG:Image URL)
            </label>
            <input
              type="text"
              value={seo.og_image_url}
              onChange={(e) => setSeo({ ...seo, og_image_url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
            Global Meta Description *
          </label>
          <textarea
            rows={2}
            required
            value={seo.global_description}
            onChange={(e) => setSeo({ ...seo, global_description: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white resize-none"
          />
        </div>
      </div>

      {/* Page Specific Meta */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3">
          Page-Specific Metadata
        </h3>

        <div className="space-y-4">
          {Object.entries(seo.page_meta).map(([route, meta]) => (
            <div
              key={route}
              className="p-4 rounded-xl border border-amber-500/20 bg-[#071324]/50 space-y-3"
            >
              <div className="text-xs font-bold font-mono text-blue-600">
                Route: {route}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-300 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={meta.title}
                    onChange={(e) =>
                      handlePageMetaChange(route, "title", e.target.value)
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#0d1f38] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-300 mb-1">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={meta.description}
                    onChange={(e) =>
                      handlePageMetaChange(route, "description", e.target.value)
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#0d1f38] text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
