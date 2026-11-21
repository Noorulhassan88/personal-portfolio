"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  AlertTriangle,
  Globe,
  Mail,
  ToggleLeft,
} from "lucide-react";
import { WebsiteSettings } from "@/types/portfolio";
import { initialWebsiteSettings } from "@/data/initialData";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>(initialWebsiteSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_settings");
      if (local) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(local) }));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem("portfolio_settings", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus("saving");

    try {
      localStorage.setItem("portfolio_settings", JSON.stringify(settings));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_settings_updated"));

      // Also sync matching fields into portfolio_homepage_settings in localStorage
      try {
        const hpLocal = localStorage.getItem("portfolio_homepage_settings");
        if (hpLocal) {
          const hpParsed = JSON.parse(hpLocal);
          const hpUpdated = {
            ...hpParsed,
            social_email: settings.contact_email || hpParsed.social_email,
            social_github: settings.github_url || hpParsed.social_github,
            social_linkedin: settings.linkedin_url || hpParsed.social_linkedin,
          };
          localStorage.setItem("portfolio_homepage_settings", JSON.stringify(hpUpdated));
        }
      } catch {}
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateSettings", payload: settings }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update website settings.");
      }

      if (resData.data) {
        setSettings(resData.data);
        try {
          localStorage.setItem("portfolio_settings", JSON.stringify(resData.data));
        } catch {}
      }

      setStatus("saved");
      setStatusMessage("Website settings updated and synchronized successfully!");
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 3500);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Saved locally in browser. Could not sync with remote database.");
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" />
            <span>System & Website Settings</span>
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Configure contact availability, site maintenance mode, primary channels, and copyright info. Click <strong>Save Settings</strong> to publish.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-sm ${
            status === "error"
              ? "bg-rose-500/10 border-rose-400/40 text-rose-300"
              : "bg-emerald-500/10 border-emerald-400/40 text-emerald-300"
          }`}
        >
          {status === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Portfolio Settings */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3 flex items-center gap-2 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>General Portfolio & Brand Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Website / Portfolio Name *
              </label>
              <input
                type="text"
                required
                value={settings.site_name}
                onChange={(e) =>
                  setSettings({ ...settings, site_name: e.target.value })
                }
                placeholder="Noorul Hassan Portfolio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Primary Contact Email *
              </label>
              <input
                type="email"
                required
                value={settings.contact_email}
                onChange={(e) =>
                  setSettings({ ...settings, contact_email: e.target.value })
                }
                placeholder="noorulhassan.ai@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                GitHub Organization / User Profile URL
              </label>
              <input
                type="url"
                value={settings.github_url}
                onChange={(e) =>
                  setSettings({ ...settings, github_url: e.target.value })
                }
                placeholder="https://github.com/Noorulhassan88"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={settings.linkedin_url}
                onChange={(e) =>
                  setSettings({ ...settings, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Twitter / X Profile URL
              </label>
              <input
                type="url"
                value={settings.twitter_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, twitter_url: e.target.value })
                }
                placeholder="https://twitter.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.copyright_text}
                onChange={(e) =>
                  setSettings({ ...settings, copyright_text: e.target.value })
                }
                placeholder="© 2026 Noorul Hassan. All rights reserved."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Feature Switches & Modes */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Feature Controls & System Toggles</span>
          </h3>

          <div className="flex items-center justify-between py-3 border-b border-amber-500/20">
            <div>
              <div className="text-xs font-bold text-white">
                Enable Public Contact Form
              </div>
              <p className="text-[11px] text-amber-200/80">
                Allows public visitors to submit inquiries directly into your admin messages inbox.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.contact_form_enabled}
              onChange={(e) =>
                setSettings({ ...settings, contact_form_enabled: e.target.checked })
              }
              className="w-5 h-5 accent-amber-400 cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-amber-500/20">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Maintenance Mode</span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                Displays a friendly maintenance banner while you perform major system modifications.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) =>
                setSettings({ ...settings, maintenance_mode: e.target.checked })
              }
              className="w-5 h-5 accent-amber-400 cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-xs font-bold text-white">
                Web Analytics Tracking
              </div>
              <p className="text-[11px] text-amber-200/80">
                Enable privacy-friendly page view analytics and interaction monitoring.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.analytics_enabled}
              onChange={(e) =>
                setSettings({ ...settings, analytics_enabled: e.target.checked })
              }
              className="w-5 h-5 accent-amber-400 cursor-pointer rounded"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-md">
          <div>
            <h4 className="text-sm font-bold text-white">Ready to save modifications?</h4>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Click <strong>Save Settings</strong> to write changes to Supabase and refresh system caches.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={status === "saving"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{status === "saving" ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
