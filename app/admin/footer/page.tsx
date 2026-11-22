"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PanelBottom,
  Sparkles,
  Mail,
  Eye,
  RefreshCw,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";
import { FooterSettings } from "@/types/portfolio";
import { initialFooterSettings } from "@/data/initialData";

export default function AdminFooterPage() {
  const [footer, setFooter] = useState<FooterSettings>(initialFooterSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_footer_settings");
      if (local) {
        setFooter((prev) => ({ ...prev, ...JSON.parse(local) }));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=footer")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setFooter((prev) => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem("portfolio_footer_settings", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus("saving");
    setStatusMessage("");

    // 1. Immediately store in localStorage & fire custom events for instant client reactivity
    try {
      localStorage.setItem("portfolio_footer_settings", JSON.stringify(footer));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_footer_updated"));
    } catch (err) {
      console.error("Local storage error:", err);
    }

    // 2. Persist to API / Supabase
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateFooter",
          payload: footer,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update footer settings.");
      }

      if (resData.data) {
        setFooter(resData.data);
        try {
          localStorage.setItem("portfolio_footer_settings", JSON.stringify(resData.data));
        } catch {}
      }

      setStatus("saved");
      setStatusMessage("Footer settings saved and synchronized live across all website pages!");
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 4000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Saved to local session. Cloud sync failed.");
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 4000);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <PanelBottom className="w-6 h-6 text-amber-400" />
              <span>Footer Section Manager</span>
            </h1>
            <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1">
            Customize all texts, brand descriptions, status badges, social links, and bottom bar in the website footer.
          </p>
        </div>

        {/* Top Header Save Changes Button */}
        <button
          onClick={() => handleSave()}
          disabled={status === "saving"}
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
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border shadow-lg ${
            status === "error"
              ? "bg-rose-950/80 border-rose-500/40 text-rose-200"
              : "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
          }`}
        >
          {status === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Brand & Bio Column */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Brand Identity & Bio Texts</span>
            </h3>
            <span className="text-[11px] text-amber-300/80 font-mono">Column 1 (Left)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Monogram Initials *
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={footer.brand_monogram}
                onChange={(e) =>
                  setFooter({ ...footer, brand_monogram: e.target.value.toUpperCase() })
                }
                placeholder="NH"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-9">
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Brand Display Name *
              </label>
              <input
                type="text"
                required
                value={footer.brand_name}
                onChange={(e) => setFooter({ ...footer, brand_name: e.target.value })}
                placeholder="Noorul Hassan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
              Footer Bio & Specialization Description *
            </label>
            <textarea
              rows={3}
              required
              value={footer.bio_description}
              onChange={(e) => setFooter({ ...footer, bio_description: e.target.value })}
              placeholder="Full Stack Developer and AI Engineer passionate about..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white leading-relaxed focus:outline-none focus:border-amber-400 resize-none"
            />
            <p className="text-[11px] text-amber-200/60 mt-1">
              This short description appears directly below your name in the footer.
            </p>
          </div>

          <div className="pt-2 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Availability & Status Text
              </label>
              <input
                type="text"
                value={footer.status_text}
                onChange={(e) => setFooter({ ...footer, status_text: e.target.value })}
                placeholder="Available for engineering opportunities & AI collaborations"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-5">
              <span className="text-xs font-semibold text-white">Show Status Badge</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={footer.status_enabled}
                  onChange={(e) => setFooter({ ...footer, status_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Columns Headers & Social Links */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Navigation Titles & Connect Links</span>
            </h3>
            <span className="text-[11px] text-amber-300/80 font-mono">Columns 2 & 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Navigation Column Header
              </label>
              <input
                type="text"
                value={footer.nav_title}
                onChange={(e) => setFooter({ ...footer, nav_title: e.target.value })}
                placeholder="Navigation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Connect Column Header
              </label>
              <input
                type="text"
                value={footer.connect_title}
                onChange={(e) => setFooter({ ...footer, connect_title: e.target.value })}
                placeholder="Connect"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={footer.github_url}
                onChange={(e) => setFooter({ ...footer, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={footer.linkedin_url}
                onChange={(e) => setFooter({ ...footer, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Contact Email Address
              </label>
              <input
                type="email"
                value={footer.email}
                onChange={(e) => setFooter({ ...footer, email: e.target.value })}
                placeholder="noorulhassan.ai@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bottom Bar & Call to Action */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PanelBottom className="w-4 h-4 text-amber-400" />
              <span>Bottom Bar & Call to Action</span>
            </h3>
            <span className="text-[11px] text-amber-300/80 font-mono">Full Width Bottom Row</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Bottom Left Copyright / Identity Text *
              </label>
              <input
                type="text"
                required
                value={footer.bottom_left_text}
                onChange={(e) => setFooter({ ...footer, bottom_left_text: e.target.value })}
                placeholder="Noorul Hassan • Full Stack Developer & AI Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Right Action Button Label *
              </label>
              <input
                type="text"
                required
                value={footer.cta_text}
                onChange={(e) => setFooter({ ...footer, cta_text: e.target.value })}
                placeholder="Get in Touch"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Right Action Link URL *
              </label>
              <input
                type="text"
                required
                value={footer.cta_link}
                onChange={(e) => setFooter({ ...footer, cta_link: e.target.value })}
                placeholder="/contact"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Live Interactive Footer Preview Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Live Footer Preview (Clean & No Arrow Marks)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Rendering
            </span>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-[#050c18] p-6 sm:p-8 text-white space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Brand Column */}
              <div className="md:col-span-6 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-[#0d1f38] border border-amber-400 text-amber-400 flex items-center justify-center font-bold text-xs tracking-wider">
                    {footer.brand_monogram || "NH"}
                  </span>
                  <span className="font-extrabold text-lg text-white">
                    {footer.brand_name || "Noorul Hassan"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  {footer.bio_description}
                </p>
                {footer.status_enabled && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                    <span className="text-xs font-semibold text-amber-300">
                      {footer.status_text}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Column */}
              <div className="md:col-span-3 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {footer.nav_title || "Navigation"}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li>About Me</li>
                  <li>Technical Skills</li>
                  <li>Projects Showcase</li>
                  <li>Experience & Timeline</li>
                  <li>Certifications</li>
                </ul>
              </div>

              {/* Connect Column (NO arrow marks) */}
              <div className="md:col-span-3 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {footer.connect_title || "Connect"}
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>GitHub</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <LinkedinIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>LinkedIn</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{footer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar (NO arrow mark on Get in Touch) */}
            <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-amber-200 font-semibold">{footer.bottom_left_text}</span>
              <span className="text-amber-400 font-bold">{footer.cta_text || "Get in Touch"}</span>
            </div>
          </div>
        </div>
      </form>

      {/* Floating Bottom Save Bar */}
      <div className="sticky bottom-4 z-40 bg-[#0d1f38]/95 backdrop-blur-md p-4 rounded-2xl border-2 border-amber-400/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <div>
            <p className="text-xs font-bold text-white tracking-wide">
              Footer Configuration Active ({footer.status_enabled ? "Status Pulse Enabled" : "Status Disabled"})
            </p>
            <p className="text-[11px] text-amber-200/70">
              Click &quot;Save Changes&quot; to commit footer texts and synchronize across the public website.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={status === "saving"}
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
